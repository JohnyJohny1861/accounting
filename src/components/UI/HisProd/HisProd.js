import React from 'react'

import classes from './HisProd.css'

const commas = (x) => {
    x = x.toString();
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

const HisProd = (props) => {       
    return (
        <div className={classes.HisProd}>
            {props.prod.borrower? <span style={{textTransform: 'capitalize'}}>{props.prod.borrower}</span> : null}
            <span style={{textTransform: 'capitalize'}}>{props.prod.name}</span>
            <span>{props.prod.type}</span>
            <span>{commas(props.prod.price)} {props.prod.currency}</span>
            <span>{props.prod.amount}</span>
            <span>{props.prod.place}</span>
            <span>{props.prod.date}</span>
            <span>
                <i onClick={props.editHandler} className="fas fa-edit"></i>
            </span>
        </div>
    )
}

export default HisProd
