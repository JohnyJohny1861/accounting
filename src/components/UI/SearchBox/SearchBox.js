import React from 'react'

import classes from './SearchBox.css'

const searchBox = (props) => {
    return (
        <input 
            id={props.id}
            onChange={props.onSearch}
            className={classes.SearchBox} 
            type={props.type} 
            placeholder={props.ph}/>
    )
}

export default searchBox
