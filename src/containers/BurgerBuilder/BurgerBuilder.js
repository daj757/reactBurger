import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.6
}
class BurgerBuilder extends Component {
    state = {
        // ingredients: {     salad: 0,     bacon: 0,     cheese: 0,     meat: 0 },
        ingredients: null,
        totalPrice: 0,
        canBuy: false,
        buying: false,
        loading: false
    }
    componentDidMount() {
        axios
            .get('https://hamburgerbuilder.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
    }
    purchaseCancelHandler = () => {
        this.setState({buying: false})
    }

    buyHandler = () => {
        this.setState({buying: true})
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price=' + this.state.totalPrice)
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
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
        this.setState({
            canBuy: sum > 0
        })

    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updateCanBuy(updatedIngredients)

    }

    removeIndgredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updateCanBuy(updatedIngredients)
    }
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;

        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        let burger = <Spinner height="175px auto"/>
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>

                    <BuildControls
                        ingredientRemoved={this.removeIndgredientHandler}
                        ingredientAdded={this.addIngredientHandler}
                        disabled={this.disabledInfo}
                        price={this.state.totalPrice}
                        canBuy={this.state.canBuy}
                        ordered={this.buyHandler}/>
                </Aux>
            )
            orderSummary = (
                <Aux>
                    <OrderSummary
                        purchaseContinue={this.purchaseContinueHandler}
                        purchaseCancelled={this.purchaseCancelHandler}
                        ingredients={this.state.ingredients}
                        price={'$' + this
                        .state
                        .totalPrice
                        .toFixed(2)}/>
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

export default withErrorHandler(BurgerBuilder, axios);