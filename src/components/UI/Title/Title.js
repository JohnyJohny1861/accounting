import React from 'react'

import classes from './Title.css';

const Title = (props) => {
  return (
    <p className={classes.Title}>{props.children}</p>
  )
}

export default Title
