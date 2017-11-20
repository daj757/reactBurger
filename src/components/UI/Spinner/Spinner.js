import React from 'react'
import classes from './Spinner.css'
const spinner = (props) => (
    <div className={classes.Loader} height={props.height} style={{margin: props.height}}>Loading...</div>

)
export default spinner;