import React, {Component} from 'react';
import SearchIcon from '@material-ui/icons/Search';
import FastfoodIcon from "@material-ui/icons/Fastfood";
import { Input, InputAdornment } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import './Header.css';

const styles = (theme) => ({
    root: {
      "& .MuiInput-underline:before": {
        borderBottomColor: "black",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "white",
      },
      "& .MuiInputBase-input": {
        color: "white",
      },
    },
});

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 0 }}>
        {props.children}
        </Typography>
    );
}

class Header extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            isModalOpen: false,
            value: 0,
            firstNameRequired: "dispNone",
            emailformRequired: "dispNone",
            pswdformRequired: "dispNone",
            contactformRequired: "dispNone",
            emailformInvalid: "dispNone",
            pswdformInvalid: "dispNone",
            contactformInvalid: "dispNone",
            contactformAlreadyExists: "dispNone",
            requiredContactform: "dispNone",
            invalidContactform: "dispNone",
            requiredpswdform: "dispNone",
            invalidpswdform: "dispNone",
            invalidCredentialform: "dispNone",
            loginContact: "",
            loginpswd: "",
            loggedInUserFirstName: sessionStorage.getItem("firstname") == null ? "" : sessionStorage.getItem("firstname"),
            firstName: "",
            lastName: "",
            email: "",
            pswd: "",
            contact: "",
            openOptions: false,
        }
    }

    async componentDidMount() {

    }

    tabChangeHandler = (event, value) => {
        this.setState({ isModalOpen: true, value: value });
    };

    contactInputFieldChangeHandler = (e) => {
        this.setState({ loginContact: e.target.value });
    };

    passwordInputFieldChangeHandler = (e) => {
        this.setState({ loginpswd: e.target.value });
    };

    openModalHandler = () => {
        this.setState({ isModalOpen: true, value: 0 });
    };

    closeModalHandler = () => {
        this.setState({ isModalOpen: false, value: 0 });
    };

    tabChangeHandler = (event, value) => {
        this.setState({ isModalOpen: true, value: value });
    };

    signupInputFieldChangeHandler = (e) => {
        console.log(e.target.id);
        if (e.target.id === "lastName") {
          this.setState({ lastName: e.target.value });
        }
        if (e.target.id === "firstName") {
          this.setState({ firstName: e.target.value });
        }
        if (e.target.id === "email") {
          this.setState({ email: e.target.value });
        }
        if (e.target.id === "pswd") {
          this.setState({ pswd: e.target.value });
        }
        if (e.target.id === "contact") {
          this.setState({ contact: e.target.value });
        }
        console.log(e.target.value);
    };

    loginBtnClickHandler = () => {
        var shouldLoginUser = true;
        if (this.state.loginContact === "") {
          this.setState({ requiredContactform: "dispBlock" });
          this.setState({ invalidContactform: "dispNone" });
          shouldLoginUser = false;
        } else {
          this.setState({ requiredContactform: "dispNone" });
    
          var isContactValid = false;
    
          if (this.state.loginContact.length !== 10) {
            isContactValid = false;
          } else {
            var notPureNumber = isNaN(this.state.loginContact);
    
            if (notPureNumber) {
              isContactValid = false;
            } else {
              isContactValid = true;
            }
          }
    
          if (isContactValid) {
            this.setState({ invalidContactform: "dispNone" });
          } else {
            this.setState({ invalidContactform: "dispBlock" });
            shouldLoginUser = false;
          }
        }
    
        if (this.state.loginpswd === "") {
          this.setState({ requiredpswdform: "dispBlock" });
          shouldLoginUser = false;
        } else {
          //requiredpswdform
          this.setState({ requiredpswdform: "dispNone" });
        }
    
        if (shouldLoginUser) {
          this.loginUser();
        }
    };

    loginUser = () => {
        let that = this;
        let dataLogin = null;
    
        let xhrLogin = new XMLHttpRequest();
        xhrLogin.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            if (
              xhrLogin.getResponseHeader("access-token") === undefined ||
              xhrLogin.getResponseHeader("access-token") === null
            ) {
              if (JSON.parse(this.responseText).code === "ATH-001") {
                that.setState({
                  invalidCredentialform: "dispNone",
                });
                that.setState({ invalidpswdform: "dispBlock" });
              } else {
                that.setState({
                  invalidCredentialform: "dispBlock",
                });
                that.setState({ invalidpswdform: "dispNone" });
              }
            } else {
              that.setState({
                invalidCredentialform: "dispNone",
              });
              //invalidpswdform
              that.setState({ invalidpswdform: "dispNone" });
              console.log(xhrLogin.getResponseHeader("access-token"));
    
              sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
              sessionStorage.setItem(
                "firstname",
                JSON.parse(this.responseText).first_name
              );
              sessionStorage.setItem(
                "access-token",
                xhrLogin.getResponseHeader("access-token")
              );
    
              that.setState({
                loggedIn: true,
                loggedInUserFirstName: JSON.parse(this.responseText).first_name,
                loggedInSuccessfullyMessageClass: "show",
              });
              // After 3 seconds, remove the show class from DIV
              setTimeout(function () {
                that.setState({ loggedInSuccessfullyMessageClass: "" });
              }, 3000);
              that.closeModalHandler();
            }
          }
        });
    
        xhrLogin.open("POST", "http://localhost:8080/api/customer/login");
        xhrLogin.setRequestHeader(
          "Authorization",
          "Basic " +
          window.btoa(this.state.loginContact + ":" + this.state.loginpswd)
        );
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);
    };
    
    
      // signup Button Click Handler
    signupBtnClickHandler = () => {
        var shouldSignUpUser = true;
        if (this.state.firstName === "") {
          this.setState({ firstNameRequired: "dispBlock" });
          shouldSignUpUser = false;
        } else {
          this.setState({ firstNameRequired: "dispNone" });
        }
        if (this.state.email === "") {
          this.setState({ emailformRequired: "dispBlock" });
          this.setState({ emailformInvalid: "dispNone" });
          shouldSignUpUser = false;
        } else {
          this.setState({ emailformRequired: "dispNone" });
    
          var isEmailValid = false;
          var splitEmailFirstTime = this.state.email.split("@");
    
          try {
            if (splitEmailFirstTime[1].length > 0) {
              var splitEmailAgain = splitEmailFirstTime[1].split(".");
              if (splitEmailAgain[1].length > 0) {
                isEmailValid = true;
              } else {
                isEmailValid = false;
              }
            } else {
              isEmailValid = false;
            }
          } catch (error) {
            isEmailValid = false;
          }
    
          if (isEmailValid) {
            this.setState({ emailformInvalid: "dispNone" });
          } else {
            shouldSignUpUser = false;
            this.setState({ emailformInvalid: "dispBlock" });
          }
        }
        if (this.state.pswd === "") {
          this.setState({ pswdformRequired: "dispBlock" });
          this.setState({ pswdformInvalid: "dispNone" });
          shouldSignUpUser = false;
        } else {
          this.setState({ pswdformRequired: "dispNone" });
    
          var ispswdValid = false;
    
          if (this.state.pswd.length < 8) {
            ispswdValid = false;
          } else {
            // Regex to check valid password.
            var regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#@$%&*!^]).{8,20}$/;
    
            ispswdValid = this.state.pswd.match(regex);
          }
    
          if (ispswdValid) {
            this.setState({ pswdformInvalid: "dispNone" });
          } else {
            shouldSignUpUser = false;
            this.setState({ pswdformInvalid: "dispBlock" });
          }
        }
        if (this.state.contact === "") {
          this.setState({ contactformRequired: "dispBlock" });
          this.setState({ contactformInvalid: "dispNone" });
          shouldSignUpUser = false;
        } else {
          this.setState({ contactformRequired: "dispNone" });
    
          var isContactValid = false;
    
          if (this.state.contact.length !== 10) {
            isContactValid = false;
          } else {
            var notPureNumber = isNaN(this.state.contact);
    
            if (notPureNumber) {
              isContactValid = false;
            } else {
              isContactValid = true;
            }
          }
    
          if (isContactValid) {
            this.setState({ contactformInvalid: "dispNone" });
          } else {
            shouldSignUpUser = false;
            this.setState({ contactformInvalid: "dispBlock" });
          }
        }
    
        if (shouldSignUpUser) {
          this.signUpUser();
        } 
      };
    
      // sign Up User
    signUpUser = () => {
        let that = this;
        let dataSignUp = JSON.stringify({
          contact_number: this.state.contact,
          email_address: this.state.email,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          password: this.state.pswd,
        });
    
        let xhrSignup = new XMLHttpRequest();
        xhrSignup.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            if (this.status === 201) {
              console.log("signup call state : " + this.readyState);
              //registeredSuccessfullyMessageClass
              that.setState({
                isModalOpen: true,
                value: 0,
                registeredSuccessfullyMessageClass: "show",
              });
              // After 3 seconds, remove the show class from DIV
              setTimeout(function () {
                that.setState({ registeredSuccessfullyMessageClass: "" });
              }, 3000);
            } else {
              //this.state.contactformAlreadyExists
              that.setState({ contactformRequired: "dispNone" });
              that.setState({ contactformInvalid: "dispNone" });
              that.setState({
                contactformAlreadyExists: "dispBlock",
              });
            }
          }
        });
    
        xhrSignup.open("POST", "http://localhost:8080/api/customer/signup");
        xhrSignup.setRequestHeader("Accept", "application/json;charset=UTF-8");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send(dataSignUp);
    };

    profileClickHandler = () => {
          if (this.state["openOptions"]) {
            this.setState({ "openOptions": false });
          } else {
            this.setState({ "openOptions": true });
          }
    };

    profilePageNavigationHandler = () => {
        this.props.history.push("/profile");
    };

    logoutClickHandler = () => {
        let that = this;
        let dataSignUp = null;
        this.setState({ "openOptions": false });
    
        let xhrSignup = new XMLHttpRequest();
        xhrSignup.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              // console.log(sessionStorage.getItem('access-token'));
              sessionStorage.removeItem("uuid");
              sessionStorage.removeItem("access-token");
              sessionStorage.removeItem("firstname");
              that.setState({ loggedIn: false, loggedInUserFirstName: "" });
            } else {
            }
          }
        });
    
        xhrSignup.open("POST", "http://localhost:8080/api/customer/logout");
        xhrSignup.setRequestHeader("Accept", "application/json;charset=UTF-8");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.setRequestHeader(
          "authorization",
          "Bearer " + sessionStorage.getItem("access-token")
        );
        // console.log(sessionStorage.getItem("access-token"));
        xhrSignup.send(dataSignUp);
    };
   
    //header renderer function
    render() {
        const { classes } = this.props;
        const customStyles = {
            content: {
              width: 350,
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
        };
        return (
            <div className="app-header">
                <Grid container>
                    <Grid item xs={12} sm={12} md={5}>
                        <div className="logo-icon">
                            <FastfoodIcon fontSize="large" />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <div className="search-container">
                            <TextField
                            style={{ width: 300 }}
                            placeholder="Search by Restaurant name"
                            onChange={this.filterRestaurantHandler}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon htmlColor="white" />
                                </InputAdornment>
                                ),
                            }}
                            classes={{ root: classes.root}}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={1}>
                        <div className="login-btn">
                        {!this.state.loggedIn && (
                            <Button
                                variant="contained"
                                color="default"
                                startIcon={<AccountCircleIcon />}
                                onClick={this.openModalHandler}
                                style={{ width: 90, left: 5 }}
                            >
                                Login
                            </Button>
                        )}
                        {this.state.loggedIn && ( 
                            <div
                                onClick={this.profileClickHandler}
                                className="header-login-btn-div"
                            >
                                <div className="logged-in-user-first-name-div">
                                <AccountCircleIcon />
                                <p className="loggedInUserName-para">
                                    {this.state.loggedInUserFirstName}
                                </p>
                                </div>
                            </div>
                        )}
                        </div>
                    </Grid>
                </Grid>

                <Modal
                    id="login-register-modal"
                    ariaHideApp={false}
                    isOpen={this.state.isModalOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}
                >
                <Tabs value={this.state.value} onChange={this.tabChangeHandler}>
                    <Tab label="LOGIN" />
                    <Tab label="SIGNUP" />
                </Tabs>
                <TabContainer>
                    {this.state.value === 0 && (
                    <div>
                        <div className="form-control-container">
                        <FormControl className="form-control-login" required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input
                            id="contact"
                            type="text"
                            onChange={this.contactInputFieldChangeHandler}
                            />
                            <FormHelperText
                            className={this.state.requiredContactform}
                            style={{ color: "#f05945" }}
                            >
                            required
                            </FormHelperText>
                            <FormHelperText
                            className={this.state.invalidContactform}
                            style={{ color: "#f05945" }}
                            >
                            Invalid Contact
                            </FormHelperText>
                        </FormControl>
                        </div>
                        <div className="form-control-container">
                        <FormControl className="form-control-login" required>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                            id="password"
                            type="password"
                            onChange={this.passwordInputFieldChangeHandler}
                            />
                            <FormHelperText
                            className={this.state.requiredpswdform}
                            style={{ color: "#f05945" }}
                            >
                            required
                            </FormHelperText>
                            <FormHelperText
                            className={this.state.invalidpswdform}
                            style={{ color: "#f05945" }}
                            >
                            This contact number has not been registered!
                            </FormHelperText>
                            <FormHelperText
                            className={this.state.invalidCredentialform}
                            style={{ color: "#f05945" }}
                            >
                            Invalid Credentials
                            </FormHelperText>
                        </FormControl>
                        </div>
                        <div className="form-control-container">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.loginBtnClickHandler}
                        >
                            LOGIN
                        </Button>
                        </div>
                    </div>
                    )}

                    {this.state.value === 1 && (
                    <div>
                        <div className="form-control-container">
                        <FormControl className="form-control-registeration" required>
                            <InputLabel htmlFor="firstName">First Name</InputLabel>
                            <Input
                            id="firstName"
                            type="text"
                            onChange={this.signupInputFieldChangeHandler}
                            />
                            <FormHelperText
                            className={this.state.firstNameRequired}
                            style={{ color: "#f05945" }}
                            >
                            required
                            </FormHelperText>
                        </FormControl>
                        </div>
                        <div className="form-control-container">
                        <FormControl className="form-control-registeration">
                            <InputLabel htmlFor="lastName">Last Name</InputLabel>
                            <Input
                            id="lastName"
                            type="text"
                            onChange={this.signupInputFieldChangeHandler}
                            />
                        </FormControl>
                        </div>
                        <div className="form-control-container">
                        <FormControl className="form-control-registeration" required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input
                            id="email"
                            type="text"
                            onChange={this.signupInputFieldChangeHandler}
                            />
                            <FormHelperText
                            className={
                                this.state.emailformRequired
                            }
                            style={{ color: "#f05945" }}
                            >
                            required
                            </FormHelperText>
                            <FormHelperText
                            className={this.state.emailformInvalid}
                            style={{ color: "#f05945" }}
                            >
                            Invalid Email
                            </FormHelperText>
                        </FormControl>
                        </div>
                        <div className="form-control-container">
                        <FormControl className="form-control-registeration" required>
                            <InputLabel htmlFor="pswd">Password</InputLabel>
                            <Input
                            id="pswd"
                            type="password"
                            onChange={this.signupInputFieldChangeHandler}
                            />
                            <FormHelperText
                            className={this.state.pswdformRequired}
                            style={{ color: "#f05945" }}
                            >
                            required
                            </FormHelperText>
                            <FormHelperText
                            className={this.state.pswdformInvalid}
                            style={{ color: "#f05945" }}
                            >
                            Password must contain at least one capital letter, one
                            small letter, one number, and one special character
                            </FormHelperText>
                        </FormControl>
                        </div>
                        <div className="form-control-container">
                        <FormControl className="form-control-registeration" required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input
                            id="contact"
                            type="text"
                            onChange={this.signupInputFieldChangeHandler}
                            />
                            <FormHelperText
                            className={
                                this.state.contactformRequired
                            }
                            style={{ color: "#f05945" }}
                            >
                            required
                            </FormHelperText>
                            <FormHelperText
                            className={
                                this.state.contactformInvalid
                            }
                            style={{ color: "#f05945" }}
                            >
                            Contact No. must contain only numbers and must be 10
                            digits long
                            </FormHelperText>
                            <FormHelperText
                            className={
                                this.state.contactformAlreadyExists
                            }
                            style={{ color: "#f05945" }}
                            >
                            This contact number is already registered! Try other
                            contact number.
                            </FormHelperText>
                        </FormControl>
                        </div>
                        <div className="form-control-container">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.signupBtnClickHandler}
                        >
                            SIGNUP
                        </Button>
                        </div>
                    </div>
                    )}
                </TabContainer>
                </Modal>
                <div>
                    {this.state.openOptions && (
                        <div className="account-options-container">
                            <div>
                                <p onClick={this.profilePageNavigationHandler}>My Profile</p>
                            </div>
                            <p onClick={this.logoutClickHandler}>Logout</p>
                        </div>
                    )}
                </div>
            </div>
            
        )
    }
}

export default withStyles(styles, { withTheme: true })(Header);