import React, {Component} from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import { Route } from 'react-router-dom'
import ContactData from './ContactData/ContactData'
import { connect } from 'react-redux'
class Checkout extends Component {
    // Before Redux store
    // state = {
    //     ingredients: null,
    //     totalPrice: 0
    // }
    // componentWillMount(){
    //     const query = new URLSearchParams(this.props.location.search)
    //     const ingredients = {};
    //     let price = 0;
    //     for(let param of query.entries()) {
    //         if(param[0]==='price'){
    //             price = param[1]
    //         }
    //         else {
    //             ingredients[param[0]] = +param[1]
    //         }
    //     }
    //     this.setState({ingredients:ingredients, totalPrice: price})

    // }
    checkoutContinuedHandler = () => {
        const queryParams = [];
        for(let i in this.props.ings) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]))
        }
        let queryString = queryParams.join('&')
        this.props.history.replace({
            pathname: '/checkout/contact-data',
            search: '?' + queryString
        })
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack()
    }
    render() {
        return (
            <div>
                <CheckoutSummary checkoutCancelled={this.checkoutCancelledHandler} 
                checkoutContinued={this.checkoutContinuedHandler} 
                ingredients={this.props.ings}/>
                <Route path={this.props.match.path + '/contact-data'}
                 component= {ContactData} />
            </div>
        )   
    }

}
const mapStateToProps = state => {
    return {
        ings: state.ingredients
    }
}
export default connect(mapStateToProps)(Checkout);