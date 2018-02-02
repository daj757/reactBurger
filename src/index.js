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
import orderReducer from "./store/reducer/order"
import authReducer from "./store/reducer/auth"

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

// const logger = store => {
//   return next => {
//     return action => {
//       console.log("[middleware] dispacthing", action)
//       const result = next(action)
//       console.log("middleware next state", store.getState())
//       return result
//     }
//   }
// }
const rootReducers = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer
})

const store = createStore(rootReducers, composeEnhancers(applyMiddleware(thunk)))



const app = (
    <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
