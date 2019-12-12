import React from 'react'

import classes from './ErrorMsg.css'

const ErrorMsg = (props) => {
  return (
    <p className={classes.ErrorMsg}>{props.children}</p>
  )
}

export default ErrorMsg
