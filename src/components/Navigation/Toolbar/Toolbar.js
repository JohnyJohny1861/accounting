import React, {Component, Fragment} from 'react';

import classes from './Toolbar.css';
import ToggleBtn from '../../UI/ToggleBtn/ToggleBtn';
import { Link } from 'react-router-dom';
import axios from '../../../axios-orders';

class Toolbar extends Component {
    state = {
        allProds: null,
        error: null,
        kirimShow: false,
        chiqimShow: false,
        bazaShow: false
    }

    componentDidMount() {
        axios.get('/products.json')
            .then(res => this.setState({allProds: res.data}))
            .catch(err => this.setState({error: err}));
    }

    toggleHandler = (type) => {
        let doesShow;
        switch(type) {
            case 'kirim':
                doesShow = !this.state.kirimShow;
                return this.setState({
                    kirimShow: doesShow, 
                    chiqimShow: false, 
                    bazaShow: false})
            case 'chiqim':
                doesShow = !this.state.chiqimShow;
                return this.setState({
                    kirimShow: false, 
                    chiqimShow: doesShow, 
                    bazaShow: false})
            default:
                doesShow = !this.state.bazaShow;
                return this.setState({
                    kirimShow: false, 
                    chiqimShow: false, 
                    bazaShow: doesShow})
        }
    }


    render() {
        let kirim = this.state.kirimShow ? 
            <Fragment>
                <Link to="/kirdi">Input</Link>
                <Link to="/kirimTarixi">Input History</Link>
            </Fragment> : null;
        let chiqim = this.state.chiqimShow ? 
            <Fragment>
                <Link to="/chiqdi">Output</Link>
                <Link to="/chiqimTarixi">Output History</Link>
            </Fragment> : null;
        let baza = this.state.bazaShow ? <Fragment>
                <Link to="/add">Add</Link>
                <Link to="/remove">Remove</Link>
            </Fragment> : null;

        return(
            <div className={classes.Toolbar}>
                <div className={classes.KirdiChiqdi}>
                    <ToggleBtn 
                        clicked={()=>this.toggleHandler('kirim')} 
                        txt="In" 
                        bg="#0145ff" 
                        clr="#fff">
                        {kirim}
                    </ToggleBtn>

                    <ToggleBtn 
                        clicked={()=>this.toggleHandler('chiqim')} 
                        txt="Out" 
                        bg="#ff0505" 
                        clr="#fff">
                        {chiqim}
                    </ToggleBtn>
                </div>
                <div className={classes.MainPage}>
                    <a href="/">Home</a>
                </div>
                <ToggleBtn 
                    clicked={()=>this.toggleHandler('baza')} 
                    txt="Data Base" 
                    bg="#ffcc27" 
                    clr="#696969">
                    {baza}
                </ToggleBtn>
            </div>
        )
    }
}

export default Toolbar