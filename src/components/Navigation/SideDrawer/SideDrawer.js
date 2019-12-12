import React, {Component, Fragment} from 'react'

import Backdrop from '../../UI/Backdrop/Backdrop';
import classes from './SideDrawer.css'
import {withRouter ,NavLink} from 'react-router-dom';

class SideDrawer extends Component {
    state = {
        show: false
    }

    clicked = () => {
        let doesShow = this.state.show;
        this.setState({show: !doesShow});
    }
    getStores = () => {
        let ombors = []
        for(let i=1; i<=6; i++) {
            ombors.push(
                <NavLink 
                    key={i}
                    onClick={this.clicked}
                    activeClassName={classes.Active} 
                    to={`/ombor_${i}`}>Store_{i}
                </NavLink>
            )
        }
        let konteners = []
        for(let i=1; i<=16; i++) {
            konteners.push(
                <NavLink 
                    key={i}
                    onClick={this.clicked}
                    activeClassName={classes.Active} 
                    to={`/kontener_${i}`}>Contener_{i}
                </NavLink>
            )
        }
        return {ombors, konteners};
    }
    render() {
        return (
            <Fragment>
                <Backdrop show={this.state.show} clicked={this.clicked}/>
                <div className={this.state.show ? 
                    classes.SideDrawer : 
                    [classes.SideDrawer, classes.Close].join(' ')}>
                    {
                        this.props.location.pathname === '/kirdi' ||
                        this.props.location.pathname === '/kirimTarixi' ||
                        this.props.location.pathname === '/chiqdi' ||
                        this.props.location.pathname === '/chiqimTarixi' ||
                        this.props.location.pathname === '/add' ||
                        this.props.location.pathname === '/remove' ? null :
                        <div 
                            className={classes.Toggler} 
                            onClick={this.clicked}>
                            {this.state.show ?
                            <i className="fas fa-arrow-left"></i> : 
                            <i className="fas fa-arrow-right"></i>}
                        </div>
                    }
                    
                    <div className={classes.LinkContainer}>
                        <NavLink 
                            onClick={this.clicked}
                            activeClassName={classes.Active} 
                            exact
                            to="/">All Products
                        </NavLink>
                        {this.getStores().ombors}
                        {this.getStores().konteners}
                    </div>
                </div>
            </Fragment>
            )
    }
}

export default withRouter(SideDrawer)
