import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from "react-redux";
import * as actions from "../../store/actions/index"
import axios from "../../axios-orders"
class BurgerBuilder extends Component {
    state = {
        // ingredients: {     salad: 0,     bacon: 0,     cheese: 0,     meat: 0 },
        buying: false
    }
    componentDidMount() {
        this.props.onInitIngredients();
        // axios
        //     .get('https://hamburgerbuilder.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
    }
    purchaseCancelHandler = () => {
        this.setState({buying: false})
    }

    buyHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({buying: true}) 
        }
        else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push("/login")
        }
    }

    purchaseContinueHandler = () => {
        // const queryParams = [];
        // for(let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        // }
        // queryParams.push('price=' + this.state.totalPrice)
        // const queryString = queryParams.join('&')
        this.props.onInitPurchased();
        this.props.history.push("/checkout")
    }

    updateCanBuy(ingredients) {
        const sum = Object
            .keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0
    

    }
//without redux store functions
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    //     this.updateCanBuy(updatedIngredients)

    // }

    // removeIndgredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    //     this.updateCanBuy(updatedIngredients)
    // }
    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients cannot be loaded</p> : <Spinner height="175px auto"/>

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>

                    <BuildControls
                        isAuth={this.props.isAuthenticated }
                        ingredientRemoved={this.props.onIngredientRemoved}
                        ingredientAdded={this.props.onIngredientAdded}
                        disabled={disabledInfo}
                        price={this.props.price}
                        canBuy={this.updateCanBuy(this.props.ings)}
                        ordered={this.buyHandler}/>
                </Aux>
            )
            orderSummary = (
                <Aux>
                    <OrderSummary
                        purchaseContinue={this.purchaseContinueHandler}
                        purchaseCancelled={this.purchaseCancelHandler}
                        ingredients={this.props.ings}
                        price={this.props.price}/>
                </Aux>
            )
        }
        return (
            <Aux>
                <Modal show={this.state.buying} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </ Aux>
        );
    }
}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient((ingName))),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchased: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}
export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));