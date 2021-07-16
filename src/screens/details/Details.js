import React, { Fragment} from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import 'font-awesome/css/font-awesome.min.css';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';

class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantDetails: {},
            categories:[],
            locality: "",
            totalAmount: 0,
            totalItems: 0,
            orderItems: {id: null, items: [], total: 0},
            cartItems: [],
            cartItem: {},
            showCartEmpty: false,
            showNotloggedIn: false,
            itemQuantityDecreased: false,
            itemRemovedFromCart: false,
            itemQuantityIncreased: false,
            itemAddedFromCart: false,
            showItemAddedMessage: false,
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
                console.log(responseText);
                that.setState({
                    restaurantDetails: responseText, 
                    categories: responseText.categories,
                    locality: responseText.address.locality});
            }
        })
        xhrRestaurants.open('GET', this.props.baseUrl + '/api/restaurant/' + id);
        xhrRestaurants.send(dataRestaurants);
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
         //Function to get the index of the item
    getIndex = (value, arr, prop) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][prop] === value) {
                return i;
            }
        }
        return -1; 
    }

    addToCartHandler = (item) => {
        var totalAmount = this.state.totalAmount;
        var totalItems = this.state.totalItems;
        totalAmount += item.price;
        totalItems += 1;

        const newItem = this.state.cartItem;
        newItem.id = item.id;
        newItem.type = item.item_type;
        newItem.name = item.item_name;
        newItem.pricePerItem = item.price;
        newItem.quantity = 1;
        newItem.priceForAll = item.price;

        this.setState({cartItem: newItem});

        if (this.state.orderItems.items !== undefined && this.state.orderItems.items.some(a_item => (a_item.name === item.item_name))) {
            var index = this.getIndex(item.item_name, this.state.orderItems.items, "name");
            var quantity = this.state.orderItems.items[index].quantity + 1;
            var priceForAll = this.state.orderItems.items[index].priceForAll + this.state.orderItems.items[index].pricePerItem;
            var selectedItem = this.state.orderItems.items[index];
            selectedItem.quantity = quantity;
            selectedItem.priceForAll = priceForAll;
            this.setState( selectedItem);
        } else {
            this.state.cartItems.push(this.state.cartItem);
            const orderItems = this.state.orderItems;
            orderItems.items = this.state.cartItems;
            this.setState({orderItems: orderItems});
        }

        this.setState({showItemAddedMessage: true, cartItem: {}, totalItems: totalItems, totalAmount: totalAmount});
    }

    removeFromCartHandler = (item) => {
        var index = this.getIndex(item.name, this.state.orderItems.items, "name");

        if (this.state.orderItems.items[index].quantity > 1) {
            var quantity = this.state.orderItems.items[index].quantity - 1;
            var priceForAll = this.state.orderItems.items[index].priceForAll - this.state.orderItems.items[index].pricePerItem;
            var selectedItem = this.state.orderItems.items[index];
            selectedItem.quantity = quantity;
            selectedItem.priceForAll = priceForAll;
            this.setState(selectedItem);
            this.setState({itemQuantityDecreased: true});
        } else {
            this.state.orderItems.items.splice(index, 1);
            this.setState({itemRemovedFromCart: true});
        }


        var totalAmount = this.state.totalAmount;
        var totalItems = this.state.totalItems;
        totalAmount -= item.pricePerItem;
        totalItems -= 1;

        this.setState({totalItems: totalItems, totalAmount: totalAmount});

    }


    addAnItemFromCartHandler = (item, index) => {
        const itemIndex = this.getIndex(item.name, this.state.orderItems.items, "name");

        var quantity = this.state.orderItems.items[itemIndex].quantity + 1;
        var priceForAll = this.state.orderItems.items[itemIndex].priceForAll + this.state.orderItems.items[itemIndex].pricePerItem;
        var itemAdded = this.state.orderItems.items[itemIndex];
        itemAdded.quantity = quantity;
        itemAdded.priceForAll = priceForAll;
        this.setState(item);
        var totalAmount = this.state.totalAmount;
        var totalItems = this.state.totalItems;
        totalAmount += item.pricePerItem;
        totalItems += 1;

        this.setState({ itemQuantityIncreased: true, totalItems: totalItems, totalAmount: totalAmount });
    }

    checkoutHandler = () => {
        if (this.state.totalItems === 0) {
            this.setState({showCartEmpty: true});
        } else if (this.state.totalItems > 0 && sessionStorage.getItem('access-token') === null) {
            this.setState({showNotloggedIn: true});
        } else {
            this.props.history.push({
                pathname: '/checkout/',
                state: {
                    orderItems: this.state.orderItems,
                    total: this.state.totalAmount, 
                    restaurantName: this.state.restaurant_name
                }
            })
        }
    }

    handleClose = () => {
        this.setState({showItemAddedMessage: false, showNotloggedIn: false, showCartEmpty: false,
             itemQuantityIncreased: false, itemRemovedFromCart:false});
    }

    render() {
        return (
            <div>
                <Header {...this.props}
                    baseUrl={this.props.baseUrl}
                    showSearch="false"
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
                                <Typography variant="caption" className="message-color" gutterBottom> AVERAGE RATING BY <br /> <span style={{ fontWeight: 'bold' }}> {this.state.restaurantDetails.number_customers_rated} </span> USERS </Typography>
                            </div>
                            <div style={{ width: "100%" }}>
                                <i className="fa fa-inr" aria-hidden="true" style={{ fontSize: "14px" }}> <span style={{ fontWeight: '500', fontSize: "16px" }}>{this.state.restaurantDetails.average_price}</span> </i> <br />
                                <Typography variant="caption" className="message-color" gutterBottom> AVERAGE COST FOR <br /> TWO PEOPLE </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="category-items-cart-container">
                        <div className="category-items-container">
                            {this.state.categories.map(category => (
                                <div className="category" key={"category" + category.id}>
                                    <span style={{color: "grey",fontWeight: "bolder"}}>{category.category_name.toUpperCase()}</span> 
                                    <Divider style={{marginTop: "10px", marginBottom: "10px", width: '90%'}}/>
                                    {category.item_list.map(item => (
                                        <Grid container key={item.id} style={{marginBottom: 5}}>
                                            <Grid item xs={1} lg={1}>
                                                {item.item_type === "VEG" ?
                                                        <i className="fa fa-circle" aria-hidden="true"
                                                        style={{fontSize: "12px", color: "green", paddingRight: "12px"}}></i>
                                                        :
                                                        <i className="fa fa-circle" aria-hidden="true"
                                                        style={{fontSize: "12px", color: "red", paddingRight: "12px"}}></i>
                                                }
                                            </Grid>
                                            <Grid item xs={5} lg={6}>
                                                <Typography>
                                                    <span className="item-name">  {this.capitalizeFirstLetter(item.item_name)} </span>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3} lg={2}>
                                                <div className='pricePerItem'>
                                                    <span>
                                                        <i className="fa fa-inr" aria-hidden="true"></i>
                                                        <span style={{paddingLeft: "2px"}}>{item.price.toFixed(2)}</span>
                                                    </span>
                                                </div>
                                            </Grid>
                                            <Grid item xs={1} lg={1}></Grid>
                                            <Grid item xs={2} lg={2}>
                                                <IconButton style={{padding: 0, float: 'left'}}
                                                            onClick={(e) => this.addToCartHandler(item)}>
                                                    <AddIcon style={{padding: 0}} fontSize='small'/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="cart-container">
                            <Card>
                                <CardContent>
                                    <div style={{fontWeight: "bold"}}>
                                        <i style={{paddingRight: "20px", fontStyle:"normal"}}>
                                            <Badge className="badge" badgeContent={this.state.totalItems}
                                                   color="primary" showZero>
                                                <ShoppingCartIcon/>
                                            </Badge>
                                        </i>My Cart
                                    </div>
                                    <div className="cart-item-list">
                                        <Grid container>
                                            {this.state.orderItems.items !== undefined ?
                                                    this.state.orderItems.items.map((item, index) => (
                                                        <Fragment key={item.id}>
                                                            <Grid item xs={2} lg={2}>
                                                                {item.type === "VEG" ?
                                                                    <i className="fa fa-circle" aria-hidden="true"
                                                                    style={{fontSize: "12px", color: "green", paddingRight: "12px"}}></i>
                                                                   :
                                                                   <i className="fa fa-circle" aria-hidden="true"
                                                                   style={{fontSize: "12px", color: "red", paddingRight: "12px"}}></i>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={3} lg={4}>
                                                                <Typography>
                                                                    {this.capitalizeFirstLetter(item.name)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={3} lg={3} style={{flexWrap: "wrap"}}>
                                                                <div className='add-remove-icon'>
                                                                    <IconButton className='add-remove-button-hover'
                                                                                style={{display: "flex", padding: 0}}
                                                                                onClick={(e) => this.removeFromCartHandler(item)}><RemoveIcon
                                                                        fontSize='medium'
                                                                        style={{color: 'black', fontWeight: "bolder"}}/></IconButton>
                                                                    <Typography
                                                                        style={{fontWeight: 'bold'}}>{item.quantity}</Typography>
                                                                    <IconButton className='add-remove-button-hover'
                                                                        style={{ display: "flex", padding: 0 }}
                                                                        onClick={this.addAnItemFromCartHandler.bind(this, item, index)}>
                                                                        <AddIcon fontSize='medium' style={{
                                                                            color: 'black',
                                                                            fontWeight: "bold"
                                                                        }}/></IconButton>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} lg={3}>
                                                                <span style={{float: 'right'}}>
                                                                    <i className="fa fa-inr" aria-hidden="true"></i>
                                                                    <span style={{paddingLeft: "2px"}}>{item.priceForAll.toFixed(2)}</span>
                                                                </span>
                                                            </Grid>
                                                        </Fragment>
                                                    )) : null}
                                            <Grid item xs={8} lg={9}>
                                                <div style={{marginTop: 15, marginBottom: 15}}>
                                                    <span style={{fontWeight: 'bold'}}>TOTAL AMOUNT</span>
                                                </div>
                                            </Grid>
                                            <Grid item xs={4} lg={3}>
                                                <div style={{marginTop: 15, marginBottom: 15}}>
                                                    <span style={{fontWeight: 'bold', float: 'right'}}>
                                                        <i className="fa fa-inr" aria-hidden="true"
                                                           style={{paddingRight: "2px"}}></i>{this.state.totalAmount.toFixed(2)}
                                                    </span>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button className="checkout" variant="contained" color="primary" onClick={this.checkoutHandler}>
                                                    <Typography>CHECKOUT</Typography>
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                </div>
                <Snackbar
                    anchorOrigin={{vertical: 'bottom',horizontal: 'left',}}
                    open={this.state.showItemAddedMessage}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    message="Item added to cart!"
                />
                <Snackbar
                    anchorOrigin={{vertical: 'bottom',horizontal: 'left',}}
                    open={this.state.itemQuantityIncreased}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    message="Item quantity increased by 1!"
                />
                <Snackbar
                    anchorOrigin={{vertical: 'bottom',horizontal: 'left',}}
                    open={this.state.itemRemovedFromCart}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    message="Item removed from cart!"
                />
                <Snackbar
                    anchorOrigin={{vertical: 'bottom',horizontal: 'left',}}
                    open={this.state.showNotloggedIn}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    message="Please login first!"
                />
                <Snackbar
                    anchorOrigin={{vertical: 'bottom',horizontal: 'left',}}
                    open={this.state.showCartEmpty}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    message="Please add an item to your cart!"
                />
            </div>
        )
    }
}

export default Details;