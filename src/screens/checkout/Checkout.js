import React, {Component, Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import './Checkout.css';
import Header from "../../common/header/Header";

class Checkout extends Component {
    constructor() {
        super();
    }

    componentDidMount() { 
        console.log(this.props.location.state);
    }

    render () {
        if (this.props.location.state === undefined || sessionStorage.getItem('access-token') === null) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} showSearch="false" />
                <div>
                    checkout page
                </div>
            </div>
        )
    }
}

export default Checkout;