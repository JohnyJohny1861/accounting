import React from 'react';

import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

const Layout = (props) => {
    return (
        <div className={classes.Layout}>
            <Toolbar />
            <SideDrawer />
            <main className={classes.Main} style={{overflow: 'auto'}}>
                {props.children}
            </main>
        </div>
    )
} 

export default Layout
