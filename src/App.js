import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import {BrowserRouter} from 'react-router-dom'
import Checkout from './containers/Checkout/Checkout'
import { Route, Switch } from 'react-router-dom'
import Orders from './containers/Orders/Orders'
import Auth from "./containers/Auth/Auth"
class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Switch>
          <Route path='/checkout' component={Checkout} />
          <Route path='/' exact component={BurgerBuilder} />
          <Route path='/orders' exact component={Orders} />
          <Route path='/login' exact component={Auth} />
          </Switch>
         </Layout>
  
      </div>
    );
  }
}

export default App;
