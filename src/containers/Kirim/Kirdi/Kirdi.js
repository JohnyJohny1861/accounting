import React, { Component, Fragment } from 'react'

import classes from './Kirdi.css';
import Input from '../../../components/UI/Input/Input';
import Title from '../../../components/UI/Title/Title';
import Modal from '../../../components/UI/Modal/Modal';
import ErrorMsg from '../../../components/UI/ErrorMsg/ErrorMsg';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

const checkProds = (oldProds, newProd) => {
    for(let i in oldProds){
        let oldP = oldProds[i];
        if( oldP.name.toLowerCase() === newProd.name.toLowerCase() && 
            oldP.type.toLowerCase() === newProd.type.toLowerCase() && 
            oldP.price === newProd.price &&
            oldP.currency === newProd.currency){
            return [
                [i, (+oldP.amount) + (+newProd.amount), (+oldP[newProd.place] + (+newProd.amount))]
                ,
                {
                    ...newProd,
                    price: oldP.price,
                    currency: oldP.currency 
                }
            ]
        }
    }
    return null
}

export class Kirdi extends Component {
    state = {
        newProduct: {
            date: null,
            name: '',
            type: '',
            price: '',
            currency: '$',
            amount: '',
            place: 'store_1'
        },
        oldproducts: null,
        loading: true,
        msg: null,
        submitDisable: true
    }

    componentDidMount() {
        axios.get('/products.json')
            .then(res => {
                let oldProducts = {}
                for(let i in res.data) {
                    oldProducts[i] = { ...res.data[i] }; 
                }
                this.setState({oldProducts, loading: false});
            })
            .catch(err => setTimeout(() => {
                this.setState({error: true, loading: false});
            }, 4000));
    }

    addDataHandler = async () => {
        if(await checkProds(this.state.oldProducts, this.state.newProduct) === null) {
            this.setState({msg: "Product Does Not Exist", showModal: true})
        } else {
            let [index, amount, oldPlaceAmount] = await checkProds(this.state.oldProducts, this.state.newProduct)[0];
            let kirimHistoryProd = await checkProds(this.state.oldProducts, this.state.newProduct)[1];
            let updatingProds = {...this.state.oldProducts};
            let newProd = {...this.state.oldProducts[index]};
            newProd.amount = amount;
            newProd[this.state.newProduct.place] = oldPlaceAmount;
            updatingProds[index] = {...newProd};

            document.querySelector('#Kirdi_date').value='';
            document.querySelector('#Kirdi_name').value='';
            document.querySelector('#Kirdi_type').value='';
            document.querySelector('#Kirdi_price').value='';
            document.querySelector('#Kirdi_amount').value='';
            for(let i=1; i<=6; i++) {document.querySelector(`#store_${i}`).value='';}
            for(let i=1; i<=16; i++) {document.querySelector(`#contener_${i}`).value='';}
            await axios.put('/products.json', updatingProds) 
                .then(res => {})
                .catch(err => this.setState({error: err}));
            axios.post('/kirimHistory.json', kirimHistoryProd)
                .then(res => {})
                .catch(err => this.setState({error: err}));
        }
    }

    inputChangedHandler = (e) => {
        let product = {}
        let submitDisable;

        if(e.target.type === 'radio') {
            product = {...this.state.newProduct}
            product.place = e.target.value.trim();
            return this.setState({newProduct: product})
        }
        switch(e.target.placeholder) {
            case 'Date': 
                product = {...this.state.newProduct}
                product.date = e.target.value.trim();
                return this.setState({newProduct: product})
            case 'Name': 
                product = {...this.state.newProduct}
                product.name = e.target.value.trim();
                submitDisable = product.name === '' || product.type === '' || product.amount === '' || product.price === '';
                return this.setState({newProduct: product, submitDisable})
            case 'Type': 
                product = {...this.state.newProduct}
                product.type = e.target.value.trim();
                submitDisable = product.type === '' || product.name === '' || product.amount === '';
                return this.setState({newProduct: product, submitDisable})
            case 'Price': 
                product = {...this.state.newProduct}
                product.price = e.target.value.trim();
                submitDisable = product.type === '' || product.name === '' || product.amount === '' || product.price === '';
                return this.setState({newProduct: product, submitDisable})
            case 'Amount': 
                product = {...this.state.newProduct}
                product.amount = e.target.value.trim();
                submitDisable = product.amount === '' || product.type === '' || product.name === '' || product.price === '';
                return this.setState({newProduct: product, submitDisable})
            default: return null;
        }
    }

    closeModal = () => {
        this.setState({showModal: false});
    }

    getStores = () => {
        let ombors = [];
        let konteners = [];
        for(let i=1; i<=6; i++) {
            ombors.push(
                <Input
                    key={`store_${i}`} 
                    id={`store_${i}`}
                    type="radio" 
                    label={`store_${i}`} 
                    change={this.inputChangedHandler}/>
            )
        }

        for(let i=1; i<=16; i++) {
            konteners.push(
                <Input 
                    key={`contener_${i}`} 
                    id={`contener_${i}`}
                    type="radio" 
                    label={`contener_${i}`} 
                    change={this.inputChangedHandler}/>
            )
        }
        return [ombors, konteners];
    }

    priceSelectedHandler = (e) => {
        const product = {...this.state.newProduct}
        product.currency = e.target.value;
        this.setState({newProduct: product});
    }

    render() {
        let kirdi = this.state.error ? 
            <ErrorMsg>Connection Problem</ErrorMsg> :
            <Fragment>
                <Modal 
                    show={this.state.showModal}
                    modalClosed={this.closeModal}>
                        <p>{this.state.error ? this.state.error : this.state.msg}</p>
                </Modal>
                    <div className={classes.Kirdi}>
                        <Title>Input</Title>
                        <Input type="date" ph="Date" id="Kirdi_date" change={this.inputChangedHandler}/>
                        <Input type="text" ph="Name" id="Kirdi_name" change={this.inputChangedHandler}/>
                        <Input type="text" ph="Type" id="Kirdi_type" change={this.inputChangedHandler}/>
                        <div className={classes.Price}>
                            <Input type="number" ph="Price" id="Kirdi_price" change={this.inputChangedHandler}/>
                            <Input type="select" change={this.priceSelectedHandler} val={this.state.currency}/>
                    </div>
                    <Input type="number" ph="Amount" id="Kirdi_amount" change={this.inputChangedHandler}/>
                    <div className={classes.Stores}>
                        <h2>To: (Which Spot)</h2>
                        <div className={classes.Ombors}>{this.getStores()[0]}</div>
                        <div className={classes.Konteners}>{this.getStores()[1]}</div>
                    </div>
                    <Input 
                        disabled={this.state.submitDisable}
                        type="submit" 
                        btnType={this.state.submitDisable ? "Disable": "Success"} 
                        clicked={this.addDataHandler}>Submit</Input>
                </div>
            </Fragment>
        return (
            this.state.loading ? <Spinner /> : kirdi
        )
    }
}

export default Kirdi
