import React, { Component, Fragment } from 'react';

import classes from './AddProduct.css';
import Input from '../../components/UI/Input/Input';
import Title from '../../components/UI/Title/Title';
import Modal from '../../components/UI/Modal/Modal';
import ErrorMsg from '../../components/UI/ErrorMsg/ErrorMsg';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const checkProds = (oldProds, newProd) => {
    for(let i in oldProds){
        let oldP = oldProds[i];
        if( oldP.name.toLowerCase()===newProd.name.toLowerCase() && 
            oldP.type.toLowerCase()===newProd.type.toLowerCase() &&
            oldP.price === newProd.price) { return true }
    }
    return false
}

export class AddProduct extends Component {
    state = {
        newProduct: {
            name: '',
            type: '',
            price: '',
            currency: '$',
            store_1: 0,
            store_2: 0,
            store_3: 0,
            store_4: 0,
            store_5: 0,
            store_6: 0,
            contener_1: 0,
            contener_2: 0,
            contener_3: 0,
            contener_4: 0,
            contener_5: 0,
            contener_6: 0,
            contener_7: 0,
            contener_8: 0,
            contener_9: 0,
            contener_10: 0,
            contener_11: 0,
            contener_12: 0,
            contener_13: 0,
            contener_14: 0,
            contener_15: 0,
            contener_16: 0
            
        },
        oldProducts: this.props.oldprods,
        sameProd: null,
        showModal: false,
        error: null,
        msg: null,
        loading: false,
        submitDisable: true
    }

    inputChangedHandler = (e) => {
        const newProd = this.state.newProduct;
        

        let product = {}
        let submitDisable;
        switch(e.target.placeholder) {
            case 'Name': 
                product = {...newProd}
                product.name = e.target.value.replace(/\b\w/g, l => l.toUpperCase()).trim();
                submitDisable = e.target.value.trim() === '' || newProd.type === '' || newProd.price === '';
                return this.setState({newProduct: product, submitDisable: submitDisable})
            case 'Type': 
                product = {...newProd}
                product.type = e.target.value.replace(/\b\w/g, l => l.toUpperCase()).trim();
                submitDisable = newProd.name === '' || e.target.value.trim() === '' || newProd.price === '';
                return this.setState({newProduct: product, submitDisable: submitDisable})
            case 'Price': 
                product = {...newProd}
                product.price = e.target.value.trim();
                submitDisable = newProd.name === '' || newProd.type === '' || e.target.value.trim() === '';
                return this.setState({newProduct: product, submitDisable: submitDisable})
            case '1-store': 
                product = {...newProd}
                product.store_1 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '2-store': 
                product = {...newProd}
                product.store_2 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '3-store': 
                product = {...newProd}
                product.store_3 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '4-store': 
                product = {...newProd}
                product.store_4 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '5-store': 
                product = {...newProd}
                product.store_5 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '6-store': 
                product = {...newProd}
                product.store_6 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '1-contener': 
                product = {...newProd}
                product.contener_1 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '2-contener': 
                product = {...newProd}
                product.contener_2 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '3-contener': 
                product = {...newProd}
                product.contener_3 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '4-contener': 
                product = {...newProd}
                product.contener_4 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '5-contener': 
                product = {...newProd}
                product.contener_5 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '6-contener': 
                product = {...newProd}
                product.contener_6 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '7-contener': 
                product = {...newProd}
                product.contener_7 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '8-contener': 
                product = {...newProd}
                product.contener_8 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '9-contener': 
                product = {...newProd}
                product.contener_9 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '10-contener': 
                product = {...newProd}
                product.contener_10 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '11-contener': 
                product = {...newProd}
                product.contener_11 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '12-contener': 
                product = {...newProd}
                product.contener_12 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '13-contener': 
                product = {...newProd}
                product.contener_13 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '14-contener': 
                product = {...newProd}
                product.contener_14 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '15-contener': 
                product = {...newProd}
                product.contener_15 = e.target.value.trim();
                return this.setState({newProduct: product})
            case '16-contener': 
                product = {...newProd}
                product.contener_16 = e.target.value.trim();
                return this.setState({newProduct: product})
            
            default: return null;
        }
    }

    priceSelectedHandler = (e) => {
        const product = {...this.state.newProduct}
        product.currency = e.target.value;
        this.setState({newProduct: product});
    }

    storeDataHandler = async (e) => {
        e.persist();
        await checkProds(this.props.allProds, this.state.newProduct) ? 
            this.setState({msg: "Such Product Exists", showModal: true}) :
            this.setState({msg: null, showModal: false});
        if(this.state.error === null && this.state.msg === null) {
            document.querySelector('#Add_name').value="";
            document.querySelector('#Add_type').value=""
            document.querySelector('#Add_price').value=""
            for(let i=1; i<=6; i++){document.querySelector(`#Add_store_${i}`).value=''}
            for(let i=1; i<=16; i++){document.querySelector(`#Add_contener_${i}`).value=''}
            
            axios.post('/products.json', this.state.newProduct)
                .then(res => {})
                .catch(err => this.setState({error: err}));
        }
    }

    closeModal = () => {
        this.setState({showModal: false})
    }

    getStores = () => {
        let ombors = [];
        let konteners = [];
        for(let i=1; i<=6; i++) {
            ombors.push(<Fragment key={i}>
                <Input type="number" ph={i+'-store'} id={'Add_store_'+i} change={this.inputChangedHandler}/>
            </Fragment>)
        }

        for(let i=1; i<=16; i++) {
            konteners.push(<Fragment key={i}>
                <Input type="number" ph={i+'-contener'} id={'Add_contener_'+i} change={this.inputChangedHandler}/>
            </Fragment>)
        }

        return [ombors, konteners]
    }

    render() {
        let addProduct = this.state.error ? <ErrorMsg>{this.state.error}</ErrorMsg> : 
            (<Fragment>
                <Modal 
                    show={this.state.showModal}
                    modalClosed={this.closeModal}>
                        <p>{this.state.error ? this.state.error : this.state.msg}</p>
                </Modal>
                <div className={classes.AddProduct}>
                    <Title>Add A New Product To Data Base</Title>
                    <Input type="text" ph="Name" id="Add_name" change={this.inputChangedHandler}/>
                    <Input type="text" ph="Type" id="Add_type" change={this.inputChangedHandler}/>
                    <div className={classes.Price}>
                        <Input type="number" ph="Price" id="Add_price" change={this.inputChangedHandler}/>
                        <Input type="select" change={this.priceSelectedHandler} val={this.state.newProduct.currency}/>
                    </div>
                    <div className={classes.Stores}>
                        <div className={classes.Ombors}>{this.getStores()[0]}</div>
                        <div className={classes.Konteners}>{this.getStores()[1]}</div>                        
                    </div>
                    
                    <Input 
                        disabled={this.state.submitDisable}
                        type="submit" 
                        btnType={this.state.submitDisable ? "Disable": "Success"} 
                        clicked={this.storeDataHandler}>Submit</Input>
                </div>
            </Fragment>)
        
        
        return ( addProduct )
    }
}
 
 export default withErrorHandler(AddProduct, axios);