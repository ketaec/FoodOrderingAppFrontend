import React, { Component } from 'react';
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
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from "@material-ui/core/IconButton";

class Checkout extends Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            addresses: [],
            payments: [],
            displayChange: 'display-none',
            selectedAddressId: "",
            paymentId: "",
            activeTabValue: 'existing_address',
        }
    }

    componentDidMount() { 
        if(sessionStorage.getItem('access-token')) {
            this.getAddressData();
        }
    }

    incrementActiveStep = () => {
        if (this.state.activeStep === 0 && this.state.selectedAddressId === undefined) {
            //Do nothing as it is mandatory to select an address
        } else if (this.state.activeStep === 1 && this.state.paymentId === '') {
            //Do nothing, Because user has to select payment to proceed further.
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

    changeActiveTab = (value) => {
        this.setState({activeTabValue: value})
        if (value === 'existing_address') {
            this.getAddressData();
        }
    }

    render () {
        if (this.props.location.state === undefined || sessionStorage.getItem('access-token') === null) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} showSearch="false" />
                <div className='main-container'>
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
                                                <GridList style={{flexWrap: 'nowrap'}} cols={3} cellHeight='auto'>
                                                    {
                                                        (this.state.addresses || []).map((address, index) => (
                                                            <GridListTile key={address.id}
                                                                        className={this.state.selectedAddressId === address.id ? 'grid-list-tile-selected-address' : null}>
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
                                                                            onClick={this.selectAddress}>
                                                                            <CheckCircleIcon
                                                                                id={'select-address-icon-' + address.id}
                                                                                className={this.state.selectedAddressId === address.id ? 'display-green-icon' : 'display-grey-icon'}/>
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            </GridListTile>
                                                        ))
                                                    }
                                                </GridList>
                                            }
                                        </div>


                                        <div>
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
                                            Payment modes
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
                                <Typography variant='h5'>
                                    Summary
                                </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default Checkout;