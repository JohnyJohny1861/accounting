import React, {Component} from 'react'

import classes from './ToggleBtn.css'

class ToggleBtn extends Component {
    state = {
        show: false
    }

    render() {
        return (
            <div 
                className={classes.ToggleBtn} 
                onClick={this.props.clicked}>
                <button 
                    style={{
                        backgroundColor: this.props.bg,
                        color: this.props.clr
                    }}
                    className={classes.Toggler}>
                    {this.props.txt}
                </button>
                <div className={classes.Content}>
                    {this.props.children}
                </div>
                    
            </div>
        )
    }
} 

export default ToggleBtn
