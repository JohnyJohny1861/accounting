import React, { Component, Fragment } from 'react';

import classes from './RemoveProduct.css';
import Input from '../../components/UI/Input/Input';
import Title from '../../components/UI/Title/Title';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import ErrorMsg from '../../components/UI/ErrorMsg/ErrorMsg';
import axios from '../../axios-orders';

const checkProds = (oldProds, delProd) => {
    for(let i in oldProds){
        let oldP = oldProds[i];
        if( oldP.name.toLowerCase()===delProd.name.toLowerCase() && 
            oldP.type.toLowerCase()===delProd.type.toLowerCase() &&
            oldP.price === delProd.price && oldP.currency === delProd.currency
            ) { return [i] }
    }
    return false
}

export class RemoveProduct extends Component {
    state = {
        products: {},
        name: '',
        type: '',
        price: '',
        currency: '$',
        showModal: false,
        error: false,
        msg: null,
        loading: true,
        submitDisable: true
    }

    inputChangedHandler = (e) => {
        let subState;
        switch(e.target.placeholder) {
            case 'Name':
                subState = e.target.value.trim() === '' || this.state.type === '' || this.state.price === ''
                return this.setState({name: e.target.value.trim(), submitDisable: subState})
            case 'Type': 
                subState = this.state.name === '' || e.target.value.trim() === '' || this.state.price === ''
                return this.setState({type: e.target.value.trim(), submitDisable: subState})
            case 'Price': 
                subState = this.state.name === '' || e.target.type === '' || e.target.value.trim() === '' 
                return this.setState({price: e.target.value.trim(), submitDisable: subState})
            default: return null;
        }
    }
    priceSelectedHandler = (e) => {
        this.setState({currency: e.target.value.trim()});
    }

    deleteDataHandler = async () => {
        let delProd = {
            name: this.state.name, 
            type: this.state.type, 
            price: this.state.price, 
            currency: this.state.currency}
        let product = await checkProds(this.state.products, delProd)
        if(product) {
            axios.delete(`/products/${product}.json`)
                .then(res => window.location.reload())
                .catch(err => this.setState({error: err}))
        } else {
            this.setState({msg: "Product Does Not Exist", showModal: true});
        }
    } 

    componentDidMount() {
        axios.get('/products.json')
            .then(res => {
                let products = {}
                for(let name in res.data) {
                    products[name] = {
                        ...res.data[name], 
                        name: res.data[name].name.toLowerCase(),
                        type: res.data[name].type.toLowerCase()};
                }
                this.setState({products: products, loading: false});
            })
            .catch(err => setTimeout(() => {
                this.setState({error: err, loading: false});
            }, 1000));
    }

    closeModal = () => {
        this.setState({showModal: false})
    }

    render() {
        let removeProduct = this.state.error ? 
            <ErrorMsg>Connection Problem</ErrorMsg> : 
            (<Fragment>
                <Modal 
                    show={this.state.showModal}
                    modalClosed={this.closeModal}>
                        {this.state.msg? this.state.msg: null}
                </Modal>
                <div className={classes.RemoveProduct}>
                    <Title>Remove Product From Data Base</Title>
                    <Input type="text" ph="Name" change={this.inputChangedHandler}/>
                    <Input type="text" ph="Type" change={this.inputChangedHandler}/>
                    <div className={classes.Price}>
                        <Input type="number" ph="Price" change={this.inputChangedHandler}/>
                        <Input type="select" change={this.priceSelectedHandler} val={this.state.currency}/>
                    </div>
                    <Input 
                        disabled={this.state.submitDisable}
                        type="submit" 
                        btnType={this.state.submitDisable ? "Disable": "Success"} 
                        clicked={this.deleteDataHandler}>Submit</Input>
                </div>
            </Fragment>)
        return (
            this.state.loading ? <Spinner /> : removeProduct
        )
    }
}
 
 export default RemoveProduct
