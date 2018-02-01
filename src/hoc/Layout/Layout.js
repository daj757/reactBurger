import React, {Component} from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
import { connect } from "react-redux"
class Layout extends Component {
    state = {
        showSideDrawer: false
    }
    sideDrawerCloseHandler = () => {
        this.setState({showSideDrawer: false})
    }
    sideDrawerOpenHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer}
    })
}
   render() { 
   return (
   <Aux>
    <Toolbar
     isAuth={this.props.isAuthenticated}
     openMenu={this.sideDrawerOpenHandler}/>
    <SideDrawer 
    isAuth={this.props.isAuthenticated}
    open={this.state.showSideDrawer}
    closed={this.sideDrawerCloseHandler}/>
    <main className={classes.Content}>
        {this.props.children}
        </main>
        </Aux>
   )}
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);