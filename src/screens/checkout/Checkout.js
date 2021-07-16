import React, {Component, Fragment} from 'react';
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

class Checkout extends Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            addresses: [],
            payments: [],
            displayChange: 'display-none',
            selectedAddressId: "clear address",
            paymentId: "clear paymentid",
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
                                            Address
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