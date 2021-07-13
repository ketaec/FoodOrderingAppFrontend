import React from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';



class Details extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log(this.props.location.pathname);
        let {id} = this.props.match.params;
        console.log(id);

    }

    render() {
        return (
            <div>
                <Header {...this.props}
                    baseUrl={this.props.baseUrl}
                    showSearch="false"
                    searchHandler={this.searchHandler}
                />
                <div>
                    details page
                </div>
            </div>
        )
    }
}

export default Details;