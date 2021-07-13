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

    render() {
        return (
            <div>
                <Header {...this.props}
                    baseUrl={this.props.baseUrl}
                    showSearch="true"
                    searchHandler={this.searchHandler}
                />
                
            </div>
        )
    }
}

export default Home;