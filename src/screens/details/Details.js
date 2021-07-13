import React from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import 'font-awesome/css/font-awesome.min.css';
import Typography from '@material-ui/core/Typography';


class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantDetails: {},
            categories:[],
            locality: ""
        }
    }

    componentDidMount() {
        let {id} = this.props.match.params;
        this.getRestaurantDetails(id);
    }

    getRestaurantDetails = (id) => {
        let that = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let responseText = JSON.parse(this.responseText);
                that.setState({
                    restaurantDetails: responseText, 
                    categories: responseText.categories,
                    locality: responseText.address.locality});
            }
        })
        xhrRestaurants.open('GET', this.props.baseUrl + '/api/restaurant/' + id);
        xhrRestaurants.send(dataRestaurants);
    }

    render() {
        return (
            <div>
                <Header {...this.props}
                    baseUrl={this.props.baseUrl}
                    showSearch="false"
                    searchHandler={this.searchHandler}
                />
                {/* restaurant information */}
                <div className="restaurant-information">
                    <div className="restaurant-image">
                        <div>
                        <img
                            className="img-div"
                            src={this.state.restaurantDetails.photo_URL}
                            alt='restaurant'
                            width='100%'
                        />
                        </div>
                    </div>
                    <div className="restaurant-details">
                        <div>
                            <Typography variant="h4" gutterBottom> {this.state.restaurantDetails.restaurant_name} </Typography> 
                            <Typography variant="h5" gutterBottom> {this.state.locality} </Typography> <br />
                            <Typography variant="body1" gutterBottom> {this.state.categories
                                && Array.isArray(this.state.categories)
                                && this.state.categories.length > 0
                                && this.state.categories.map((el) => el.category_name).join(", ")} </Typography>
                        </div>
                        <div style={{ float: 'left', display: "flex", flexDirection: "row", width: "100%", paddingTop: "20px" }}>
                            <div style={{ width: "100%" }}>
                                <i className="fa fa-star" aria-hidden="true"> <span style={{ fontWeight: '500' }}>{this.state.restaurantDetails.customer_rating}</span> </i> <br />
                                <Typography variant="caption" gutterBottom> AVERAGE RATING BY <br /> <span style={{ fontWeight: 'bold' }}> {this.state.restaurantDetails.number_customers_rated} </span> USERS </Typography>
                            </div>
                            <div style={{ width: "100%" }}>
                                <i className="fa fa-inr" aria-hidden="true"> <span style={{ fontWeight: '500' }}>{this.state.restaurantDetails.average_price}</span> </i> <br />
                                <Typography variant="caption" gutterBottom> AVERAGE COST FOR <br /> TWO PEOPLE </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Details;