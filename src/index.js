import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from "react-redux"; 
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import burgerBuilderReducer from "./store/reducer/burgerBuilder";
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const logger = store => {
  return next => {
    return action => {
      console.log("[middleware] dispacthing", action)
      const result = next(action)
      console.log("middleware next state", store.getState())
      return result
    }
  }
}

const store = createStore(burgerBuilderReducer, composeEnhancers(applyMiddleware(thunk)))

const app = (
    <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
