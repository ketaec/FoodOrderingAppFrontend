import React, {Component} from 'react';
import SearchIcon from '@material-ui/icons/Search';
import FastfoodIcon from "@material-ui/icons/Fastfood";
import { Input, InputAdornment } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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

class Header extends Component {
    constructor() {
        super();
    }
    
    //header renderer function
    render() {
        const { classes } = this.props;
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
                        <Button
                            variant="contained"
                            color="default"
                            startIcon={<AccountCircleIcon />}
                            onClick={this.loginHandler}
                            style={{ width: 90, left: 5 }}
                        >
                            Login
                        </Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Header);