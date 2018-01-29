import React, { Component } from "react"
import Input from "../../components/UI/Input/Input"
import Button from "../../components/UI/Button/Button"
import classes from "./Auth.css"

export default class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: "Email address"
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: "Password"
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 7
                },
                valid: false,
                touched: false
            }
        }
    }
    render() {
        let formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                Id: key,
                config: this.state.controls[key]

            })
        }
       
        const form = formElementsArray.map(formElement => (
            <Input 
            key={formElement.Id}
            invalid={!formElement.config.valid}
            touched={formElement.config.touched}
            shouldValidate={formElement.config.validation}
            changed={(event) => this.inputChangedHandler(event, formElement.Id)}
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            />
        )
        )
        
        return (
            <div className ={classes.Auth}>
                <form>
                {form}
                <Button btnType="Success">SUBMIT</Button>
                </form>
            </div>

        )
    }
    }
