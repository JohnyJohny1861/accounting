import React, { Fragment } from 'react';

import classes from './Input.css';

const Input = (props) => {
    switch(props.type){
        case 'text': return <input 
                                onChange={props.change} 
                                className={classes.Input} 
                                type='text' 
                                id={props.id}
                                placeholder={props.ph} />
        case 'number': return <input 
                                onChange={props.change} 
                                className={classes.Input} 
                                type='number' 
                                id={props.id}
                                placeholder={props.ph} />
        case 'password': return <input 
                                onChange={props.change} 
                                className={classes.Input} 
                                type='password' 
                                id={props.id}
                                placeholder={props.ph} />
        case 'date': return <input 
                                onChange={props.change} 
                                className={classes.Input} 
                                type='date' 
                                placeholder={props.ph}
                                id={props.id} />
        case 'radio': return (
            <Fragment>
                <label htmlFor={props.id}>{props.label}
                <input
                    id={props.id} 
                    onChange={props.change} 
                    className={classes.Radio} 
                    type='radio' 
                    name='places'
                    value={props.label} />
                </label>
            </Fragment>
        )
        case 'select': 
            return (<select className={classes.Select} name="price" onChange={props.change} id={props.id}>
                      <option id={props.usdId} value="$">$</option>
                      <option id={props.uzsId} value="so'm">so'm</option>
                   </select>)
        case 'submit':
            return <button 
                disabled={props.disabled}
                onClick={props.clicked}
                className={[classes.Button, classes[props.btnType]].join(' ')}>{props.children}</button>
        default: return null
    }
}

export default Input
