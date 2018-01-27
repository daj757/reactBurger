import React, {Component} from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import {connect} from 'react-redux'
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler"
import * as actions from "../../../store/actions/index"
class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "Your name"
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "Your Street"
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "ZIP CODE"
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "Country"
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: "Email"
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {
                            value: 'fastest',
                            displayValue: 'Fastest'
                        }, {
                            value: 'cheapest',
                            displayValue: 'Cheapest'
                        }
                    ]
                },
                value: 'fastest',
                validation: {
                    required: true
                }
            }
        }
       
    }
    orderHandler = (event) => {
        event.preventDefault();
        const formData = {}
            for (let formId in this.state.orderForm) {
                formData[formId] = this.state.orderForm[formId].value
            }
    
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        this.props.onOrderBurger(order)
        // axios
        //     .post('/orders.json', order)
        //     .then(response => this.setState({loading: false}), alert("Thank you :) Your order has been placed."), this.props.history.push('/'))
        //     .catch(error => console.log(error), this.setState({loading: false}))
        //     event.preventDefault()
    }

    inputChangedHandler = (event, inputId) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        } 
        const updatedFormElement = {
            ...updatedOrderForm[inputId]
        }
        // updatedFormElement.touched = true;
        updatedFormElement.value = event.target.value;
        // updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedOrderForm[inputId] = updatedFormElement;
        this.setState({orderForm: updatedOrderForm})

    }
    // checkValidity(value, rules){
    //     let isValid = false;
    //     if (rules.required) {
    //         isValid = value.trim() !== '' && isValid
    //     }
    //     if (rules.minLength) {
    //         isValid = value.length >= rules.minLength && isValid
    //     }
    //     if (rules.maxLength) {
    //         isValid = value.length <= rules.maxLength && isValid
    //     }
    //     return isValid;

    // }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]

            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                    invalid={!formElement.config.valid}
                    touched={formElement.config.touched}
                    shouldValidate={formElement.config.validation}
                    key={formElement.id}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}/>
                )
                )}
                <Button btnType="Success">ORDER</Button>

            </form>

        )
        if (this.props.loading) {
            form = <Spinner/>

        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact information below</h4>
                {form}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        loading: state.loading
    }
}

const mapDispatchToProps = dispatch => {
    onOrderBurger:(orderData) => {
        return dispatch(actions.purchaseBurger(orderData))
        
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));