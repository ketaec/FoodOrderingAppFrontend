import React, {Component} from 'react';
import './Home.css';
import Header from '../../common/header/Header';
// import GridList from '@material-ui/core/GridList';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
// import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
// import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from "@material-ui/core/Typography";
import '../../../node_modules/font-awesome/css/font-awesome.min.css';

class Home extends Component { 

    constructor() {
        super();
        this.state = {
            restaurants: [],
            cards: 4
        }
    }

    componentDidMount() {
        let _this = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (!JSON.parse(this.responseText).restaurants) {
                    _this.setState({
                        restaurants: [],
                    })
                } else {
                    _this.setState({
                        restaurants: JSON.parse(this.responseText).restaurants,
                    })
                }
            }
        })
        xhrRestaurants.open('GET', this.props.baseUrl + '/restaurant');
        xhrRestaurants.send(dataRestaurants);
        window.addEventListener('resize', this.noOfColumns);
    }

    searchHandler = (event) => {
        let _this = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (!JSON.parse(this.responseText).restaurants) {
                    _this.setState({
                        restaurants: [],
                    })
                } else {
                    _this.setState({
                        restaurants: JSON.parse(this.responseText).restaurants,
                    })
                }
            }
        })
        if (event.target.value === '') {
            xhrRestaurants.open('GET', this.props.baseUrl + '/restaurant');
        } else {
            xhrRestaurants.open('GET', this.props.baseUrl + '/restaurant/name/' + event.target.value);
        }
        xhrRestaurants.send(dataRestaurants);
    }

    noOfColumns = () => {

        if (window.innerWidth >= 320 && window.innerWidth <= 600) {
            this.setState({cards: 1});
            return;
        }

        if (window.innerWidth >= 601 && window.innerWidth <= 1000) {
            this.setState({cards: 2});
            return;
        }

        if (window.innerWidth >= 1001 && window.innerWidth <= 1270) {
            this.setState({cards: 3});
            return;
        }

        if (window.innerWidth >= 1271) {
            this.setState({cards: 4});
            return;
        }

    }

    restaurantCardOnClickHandler = (restaurantId) => {
        this.props.history.push('/restaurant/' + restaurantId);
    }

    render() {
        return (
            <div>
                <Header {...this.props}
                    baseUrl={this.props.baseUrl}
                    showSearch="true"
                    searchHandler={this.searchHandler}
                />
                {this.state.restaurants.length === 0 ?
                    <Typography className='restaurantMessage' variant='h6'>
                        No restaurant with the given name.
                    </Typography>
                    :
                    <div className="grid-div">
                    <ImageList
                        className='gridList'
                        cols={this.state.cards}
                        rowHeight='auto'
                    >
                        {this.state.restaurants.map(restaurant => (
                            <ImageListItem
                                onClick={() => this.restaurantCardOnClickHandler(restaurant.id)}
                                key={'restaurant' + restaurant.id}
                            >
                                <Card className='card' style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    <CardMedia
                                        className='cardMedia'
                                        image={restaurant.photo_URL}
                                        title={restaurant.restaurant_name}
                                    />
                                    <CardContent className='cardContent'>
                                        <Typography className='restaurantName' gutterBottom variant='h5' component='h2'>
                                            {restaurant.restaurant_name}
                                        </Typography>
                                        <Typography variant='subtitle1' className='categories'>
                                            {restaurant.categories}
                                        </Typography>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', color: "white", backgroundColor: "#FDD835", padding: 5, justifyContent: 'space-evenly', alignItems: 'center', width: 80 }}>
                                                <i className="fa fa-star" aria-hidden="true"> </i>
                                                <span className="white">{restaurant.customer_rating}({restaurant.number_customers_rated})</span>
                                            </div>
                                            <div>
                                                <i className="fa fa-inr price-div" aria-hidden="true">
                                                    <span className="price-div">{restaurant.average_price} for two</span> </i>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ImageListItem>
                        ))}
                    </ImageList>
                    </div>
                }
            </div>
        )
    }
}

export default Home;