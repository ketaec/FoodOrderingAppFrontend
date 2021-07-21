import React, { Component, Fragment } from 'react';
import {Redirect} from 'react-router-dom';
import './Checkout.css';
import Header from "../../common/header/Header";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import 'font-awesome/css/font-awesome.min.css';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            addresses: [],
            payments: [],
            states: [],
            displayChange: 'display-none',
            selectedAddressId: "",
            paymentId: "",
            activeTabValue: 'existing_address',
            flat: '',
            locality: '',
            city: '',
            stateUUID: '',
            pincode: '',
            flatRequired: false,
            localityRequired: false,
            cityRequired: false,
            stateUUIDRequired: false,
            pincodeRequired: false,
            pincodeValid: true,
            placeOrderMessage: "",
            showPlaceOrderMessage: false,
            couponId: "",
            couponCode: "",
            discount: 0,
            discountAmount: 0,
            finalTotal: 0,
        }
    }

    componentDidMount() { 
        console.log(this.props.location.state)
        if(sessionStorage.getItem('access-token')) {
            this.getAddressData();
            this.getStatesData();
            this.getPayments();
        }
        this.setState({finalTotal: this.props.location.state.total});
    }

    incrementActiveStep = () => {
        if (this.state.activeStep === 0 && this.state.selectedAddressId === "") {
            //Do nothing as it is mandatory to select an address
            return;
        } else if (this.state.activeStep === 1 && this.state.paymentId === "") {
            //Do nothing, Because user has to select payment to proceed further.
            return;
        } else {
            let activeState = this.state.activeStep + 1;
            let changeAddressPayment = 'display-none';
            if (activeState === 2) {
                changeAddressPayment = 'display-block';
            }
            this.setState({activeStep: activeState, displayChange: changeAddressPayment})
        }
    }

    decrementActiveStep = () => {
        this.setState({activeStep: this.state.activeStep - 1});
    }

    resetActiveStep = () => {
        this.setState({activeStep: 0, displayChange: 'display-none'})
    }

    // function to get address data
    getAddressData = () => {
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({addresses: JSON.parse(this.responseText).addresses});
            }
        });

        let url = this.props.baseUrl + '/address/customer';
        xhr.open('GET', url);
        let token = sessionStorage.getItem('access-token');
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    // function to get states data
    getStatesData = () => {
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({states: JSON.parse(this.responseText).states});
            }
        });
        let url = this.props.baseUrl + '/states';
        xhr.open('GET', url);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    // function to get payments data
    getPayments = () => {
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({payments: JSON.parse(this.responseText).paymentMethods});
            }
        });
        let url = this.props.baseUrl + '/payment';
        xhr.open('GET', url);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    changeActiveTab = (value) => {
        this.setState({activeTabValue: value})
        if (value === 'existing_address') {
            this.getAddressData();
        }
    }

    onInputFieldChangeHandler = (e) => {
        let stateKey = e.target.id;
        let stateValue = e.target.value;

        if (stateKey === undefined) {
            stateKey = 'stateUUID';
        }

        let stateValueRequiredKey = stateKey + 'Required';
        let stateKeyRequiredValue = false;
        if (stateValue === '') {
            stateKeyRequiredValue = true;
        }

        let validPincode = this.state.pincodeValid;
        if (stateKey === 'pincode') {
            validPincode = this.validatePincode(stateValue);
        }

        this.setState({
            [stateKey]: stateValue,
            [stateValueRequiredKey]: stateKeyRequiredValue,
            'pincodeValid': validPincode
        });
    }

    // function to save address data
    saveAddress = () => {
        //validations
        let tempCityRequired = false;
        let tempPincodeRequired = false;
        let tempFlatRequired = false;
        let tempStateRequired = false;
        let tempLocalityRequired = false;
        if (this.state.city === '' || this.state.cityRequired) {
            tempCityRequired = true;
        }

        if (this.state.locality === '' || this.state.localityRequired) {
            tempLocalityRequired = true;
        }

        if (this.state.flat === '' || this.state.flatRequired) {
            tempFlatRequired = true;
        }

        if (this.state.stateUUID === '' || this.state.stateUUIDRequired) {
            tempStateRequired = true;
        }

        if (this.state.pincode === '' || this.state.pincodeRequired) {
            tempPincodeRequired = true;
        }

        if (tempFlatRequired || tempPincodeRequired || tempStateRequired || tempLocalityRequired || tempCityRequired) {
            this.setState({
                flatRequired: tempFlatRequired,
                localityRequired: tempLocalityRequired,
                cityRequired: tempCityRequired,
                stateUUIDRequired: tempStateRequired,
                pincodeRequired: tempPincodeRequired
            })
            return;
        }

        let address = {
            city: this.state.city,
            flat_building_name: this.state.flat,
            locality: this.state.locality,
            pincode: this.state.pincode,
            state_uuid: this.state.stateUUID
        }

        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({city: '', locality: '', flat: '', stateUUID: '', pincode: ''});
                that.changeActiveTab('existing_address');
            }
        });

        let url = this.props.baseUrl + '/address';
        xhr.open('POST', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(address));

    }

    validatePincode = (pincode) => {
        if (pincode !== undefined && pincode.length !== 6) {
            return false;
        } else if (!isNaN(pincode) && pincode.length === 6) {
            return true;
        } else {
            return false;
        }
    }

    selectAddressHandler = (address) => {
        this.setState({selectedAddressId: address.id});
    }

    onPaymentSelection = (e) => {
        this.setState({'paymentId': e.target.value});
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // place order handler
    placeOrderHandler = () => {
        if (this.state.selectedAddressId === '' || this.state.paymentId === '' || this.state.displayChange === 'display-none') {
            this.setState({
                placeOrderMessage: 'Unable to place your order! Please try again!',
                showPlaceOrderMessage: true
            })
            return;
        }

        let bill = this.state.finalTotal;
        let itemQuantities = [];
        this.props.location.state.orderItems.items.map((item, index) => (
            itemQuantities.push({item_id: item.id, price: item.quantity * item.pricePerItem, quantity: item.quantity})
        ))
        let order = {
            address_id: this.state.selectedAddressId,
            coupon_id: this.state.couponId,
            item_quantities: itemQuantities,
            payment_id: this.state.paymentId,
            restaurant_id: this.props.location.state.restaurantId,
            bill: bill,
            discount: this.state.discount
        }

        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status === 201) {
                        let orderId = JSON.parse(this.responseText).id;
                        that.setState({
                            placeOrderMessage: 'Order placed successfully! Your order ID is ' + orderId,
                            showPlaceOrderMessage: true
                        });
                    } else {
                        that.setState({
                            placeOrderMessage: 'Unable to place your order! Please try again!',
                            showPlaceOrderMessage: true
                        });
                    }
                }
            }
        );

        let url = this.props.baseUrl + '/order';
        xhr.open('POST', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(order));
    }

    placeOrderMessageClose = () => {
        this.setState({showPlaceOrderMessage: false});
    }

    couponCodeInputFieldChangeHandler = (e) => {
        this.setState({couponCode: e.target.value });
    }

    // function to get coupon details
    getCouponDetails = () => {
        console.log(this.state.couponCode);
        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        console.log(JSON.parse(this.responseText));
                        const responseText = JSON.parse(this.responseText);
                        const discount = responseText.percent;
                        const discountAmount = that.props.location.state.total * (responseText.percent/100);
                        const totalAmount = that.props.location.state.total - discountAmount;
                        that.setState({couponId: responseText.id, discount: discount, discountAmount: discountAmount, finalTotal: totalAmount});
                    } else {
                        console.log("coupon not found");
                        that.setState({discount: 0, discountAmount: 0, finalTotal: that.props.location.state.total});
                    }
                }
            }
        );

        let url = this.props.baseUrl + '/order/coupon/' + this.state.couponCode;
        xhr.open('GET', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    render () {
        if (this.props.location.state === undefined || sessionStorage.getItem('access-token') === null) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} showSearch="false" />
                <div className='content-container' >
                    <Grid container>
                        <Grid item xs={12} lg={9}>
                            <Stepper activeStep={this.state.activeStep} orientation='vertical'>
                                <Step key='Delivery'>
                                    <StepLabel>Delivery</StepLabel>
                                    <StepContent>
                                        <div>
                                            <AppBar position={"relative"}>
                                                <Tabs value={this.state.activeTabValue} variant='standard'>
                                                    <Tab value='existing_address' label='EXISTING ADDRESS'
                                                        onClick={() => this.changeActiveTab('existing_address')}/>
                                                    <Tab value='new_address' label='NEW ADDRESS'
                                                        onClick={() => this.changeActiveTab('new_address')}/>
                                                </Tabs>
                                            </AppBar>
                                        </div>
                                        <div id='existing-address-display'
                                            className={this.state.activeTabValue === 'existing_address' ? 'display-block' : 'display-none'}>
                                            {this.state.addresses.length === 0 ?
                                                <Typography style={{margin: 10, marginBottom: 200}} color='textSecondary' component='p'>
                                                    There are no saved addresses! You can save an address using the 'New
                                                    Address' tab or using your ‘Profile’ menu option.
                                                </Typography> :
                                                <ImageList style={{flexWrap: 'nowrap'}} cols={3} rowHeight='auto'>
                                                    {
                                                        (this.state.addresses || []).map((address, index) => (
                                                            <ImageListItem key={address.id}
                                                                        className={this.state.selectedAddressId === address.id ? 'item-selected-address' : 'item-address'}>
                                                                <div className='address-box'>
                                                                    <p>{address.flat_building_name}</p>
                                                                    <p>{address.locality}</p>
                                                                    <p>{address.city}</p>
                                                                    <p>{address.state.state_name}</p>
                                                                    <p>{address.pincode}</p>
                                                                </div>
                                                                <Grid container>
                                                                    <Grid item xs={6} lg={10}></Grid>
                                                                    <Grid item xs={2}>
                                                                        <IconButton
                                                                            id={'select-address-button-' + address.id}
                                                                            className='select-address-icon'
                                                                            onClick={(e) => this.selectAddressHandler(address)}>
                                                                            <CheckCircleIcon
                                                                                id={'select-address-icon-' + address.id}
                                                                                className={this.state.selectedAddressId === address.id ? 'display-green-icon' : 'display-grey-icon'}/>
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            </ImageListItem>
                                                        ))
                                                    }
                                                </ImageList>
                                            }
                                        </div>
                                        <div id='new-address-display'
                                            className={this.state.activeTabValue === 'new_address' ? 'display-block' : 'display-none'}>
                                            <FormControl style={{minWidth: 300}} required>
                                                <InputLabel htmlFor='flat'>Flat/Building No</InputLabel>
                                                <Input id='flat' name='flat' type='text' value={this.state.flat}
                                                    flat={this.state.flat}
                                                    onChange={this.onInputFieldChangeHandler}/>
                                                {this.state.flatRequired ? 
                                                    <FormHelperText>
                                                        <span style={{color: "red"}}>required</span>
                                                    </FormHelperText> : null}
                                            </FormControl>
                                            <br/>
                                            <br/>
                                            <FormControl style={{minWidth: 300}} required>
                                                <InputLabel htmlFor='locality'>Locality</InputLabel>
                                                <Input id='locality' name='locality' type='text' value={this.state.locality}
                                                    locality={this.state.locality}
                                                    onChange={this.onInputFieldChangeHandler}/>
                                                {this.state.localityRequired ? 
                                                    <FormHelperText>
                                                        <span style={{color: "red"}}>required</span>
                                                    </FormHelperText> : null}
                                            </FormControl>
                                            <br/>
                                            <br/>
                                            <FormControl style={{minWidth: 300}} required>
                                                <InputLabel htmlFor='city'>City</InputLabel>
                                                <Input id='city' name='city' type='text' value={this.state.city}
                                                    city={this.state.city}
                                                    onChange={this.onInputFieldChangeHandler}/>
                                                {this.state.cityRequired ? 
                                                    <FormHelperText>
                                                        <span style={{color: "red"}}>required</span>
                                                    </FormHelperText> : null}
                                            </FormControl>
                                            <br/>
                                            <br/>
                                            <FormControl style={{minWidth: 300}} required>
                                                <InputLabel htmlFor='stateUUID'>State</InputLabel>
                                                <Select id='stateUUID' name='stateUUID' value={this.state.stateUUID}
                                                        onChange={this.onInputFieldChangeHandler}>
                                                    {this.state.states.map((state, index) => (
                                                        <MenuItem key={state.id} value={state.id}>{state.state_name}</MenuItem>
                                                    ))}
                                                </Select>
                                                {this.state.stateUUIDRequired ? 
                                                    <FormHelperText>
                                                        <span style={{color: "red"}}>required</span>
                                                    </FormHelperText> : null}
                                            </FormControl>
                                            <br/>
                                            <br/>
                                            <FormControl style={{minWidth: 300}} required>
                                                <InputLabel htmlFor='pincode'>Pincode</InputLabel>
                                                <Input id='pincode' name='pincode' type='text' value={this.state.pincode}
                                                    pincode={this.state.pincode}
                                                    onChange={this.onInputFieldChangeHandler}/>
                                                {this.state.pincodeRequired ? 
                                                    <FormHelperText>
                                                        <span style={{color: "red"}}>required</span>
                                                    </FormHelperText> : null}
                                                {!this.state.pincodeRequired && !this.state.pincodeValid ? 
                                                    <FormHelperText>
                                                        <span style={{color: "red"}}>Pincode must contain only numbers and must be 6 digits long</span>
                                                    </FormHelperText> : null}
                                            </FormControl>
                                            <br/>
                                            <br/>
                                            <FormControl style={{minWidth: 150}}>
                                                <Button variant='contained' color='secondary' onClick={this.saveAddress}>
                                                    SAVE ADDRESS</Button>
                                            </FormControl>
                                        </div>
                                        <div style={{marginTop: 20}}>
                                            <Button disabled={this.state.activeStep === 0}>Back</Button>
                                            <Button className='button' variant="contained" color="primary"
                                                    onClick={this.incrementActiveStep}>Next</Button>
                                        </div>
                                    </StepContent>
                                </Step>
                                <Step key='Payment'>
                                    <StepLabel>Payment</StepLabel>
                                    <StepContent>
                                        <div id='payment-modes'>
                                            <FormControl>
                                                <FormLabel>Select Mode of Payment</FormLabel>
                                                <RadioGroup onChange={this.onPaymentSelection} value={this.state.paymentId}>
                                                    {(this.state.payments || []).map((payment, index) => (
                                                        <FormControlLabel key={payment.id} value={payment.id} control={<Radio/>}
                                                                        label={payment.payment_name}/>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <Button onClick={this.decrementActiveStep}>Back</Button>
                                        <Button variant="contained" color="primary"
                                                onClick={this.incrementActiveStep}>Finish</Button>
                                    </StepContent>
                                </Step>
                            </Stepper>
                            <div className={this.state.displayChange} >
                                <Typography style={{marginLeft: 40}} variant='h5'>
                                    View the summary and place your order now!
                                </Typography>
                                <Button style={{marginLeft: 40, marginTop: 20}} onClick={this.resetActiveStep}>CHANGE</Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <Card variant='elevation' className='summary-card'>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        Summary
                                    </Typography>
                                    <br/>
                                    <Typography variant='h6' component='h3' color='textSecondary'
                                                style={{textTransform: "capitalize", marginBottom: 15}}>
                                        {this.props.location.state.restaurantName}
                                    </Typography>
                                    <Grid container>
                                        {this.props.location.state.orderItems.items !== undefined ?
                                                this.props.location.state.orderItems.items.map((item, index) => (
                                                    <Fragment key={item.id}>
                                                        <Grid item xs={1} lg={1}>
                                                            {item.type === "VEG" ?
                                                                <i className="fa fa-stop-circle-o" aria-hidden="true"
                                                                style={{ color: "green"}}></i>
                                                                :
                                                                <i className="fa fa-stop-circle-o" aria-hidden="true"
                                                                style={{color: "red"}}></i>
                                                            }
                                                        </Grid>
                                                        <Grid item xs={5} lg={6}>
                                                            <Typography style={{color: 'gray'}}>
                                                                {this.capitalizeFirstLetter(item.name)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={2} lg={2} style={{flexWrap: "wrap", color: 'gray'}}>
                                                            <div className='add-remove-icon'>
                                                                <Typography>{item.quantity}</Typography>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={4} lg={3}>
                                                            <span style={{float: 'right', color: 'gray'}}>
                                                                <i className="fa fa-inr" aria-hidden="true"></i>
                                                                <span style={{paddingLeft: "2px"}}>{item.priceForAll.toFixed(2)}</span>
                                                            </span>
                                                        </Grid>
                                                    </Fragment>
                                                )) : null}
                                        <Grid item xs={9} lg={9} style={{marginTop: "10px"}}>
                                            <form noValidate autoComplete="off">
                                                <TextField label="Coupon Code" variant="filled" onChange={this.couponCodeInputFieldChangeHandler} />
                                            </form>
                                        </Grid>
                                        <Grid item xs={3} lg={3} style={{marginTop: "20px"}}>
                                            <Button variant="contained" onClick={this.getCouponDetails}>
                                                <Typography>APPLY</Typography>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={8} lg={9} style={{marginTop: "10px"}}>
                                            <Typography style={{color: 'gray'}}>Sub Total</Typography>
                                        </Grid>
                                        <Grid item xs={4} lg={3} style={{marginTop: "10px"}}>
                                                <span style={{fontWeight: '400', float: 'right', color: 'gray'}}>
                                                    <i className="fa fa-inr" aria-hidden="true"
                                                        style={{paddingRight: "2px"}}></i>
                                                        {this.props.location.state.total.toFixed(2)}
                                                </span>
                                        </Grid>
                                        <Grid item xs={8} lg={9} style={{marginTop: "10px"}}>
                                            <Typography style={{color: 'gray'}}>Discount</Typography>
                                        </Grid>
                                        <Grid item xs={4} lg={3} style={{marginTop: "10px"}}>
                                                <span style={{fontWeight: '400', float: 'right', color: 'gray'}}>
                                                    <i className="fa fa-inr" aria-hidden="true"
                                                        style={{paddingRight: "2px"}}></i>
                                                        {this.state.discountAmount.toFixed(2)}
                                                </span>
                                        </Grid>
                                        <Divider style={{marginTop: "10px", marginBottom: "10px", width: '100%'}}/>
                                        <Grid item xs={8} lg={9}>
                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <span style={{fontWeight: '500'}}>Net Amount</span>
                                            </div>
                                        </Grid>
                                        <Grid item xs={4} lg={3}>
                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <span style={{fontWeight: '400', float: 'right'}}>
                                                    <i className="fa fa-inr" aria-hidden="true"
                                                        style={{paddingRight: "2px"}}></i>
                                                        {this.state.finalTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button className="checkout" variant="contained" color="primary" onClick={this.placeOrderHandler}>
                                                <Typography>PLACE ORDER</Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
                <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} key='01'
                    message={this.state.placeOrderMessage}
                    open={this.state.showPlaceOrderMessage}
                    onClose={this.placeOrderMessageClose}
                    autoHideDuration={4000}
                    action={
                    <Fragment> 
                        <IconButton color='inherit' onClick={this.placeOrderMessageClose}><CloseIcon/></IconButton>
                    </Fragment>
                }/>
              </div>
        )
    }
}

export default Checkout;