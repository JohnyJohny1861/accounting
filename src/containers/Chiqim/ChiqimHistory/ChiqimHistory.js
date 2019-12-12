import React, { Component, Fragment } from 'react'

import classes from './ChiqimHistory.css';
import HisProd from '../../../components/UI/HisProd/HisProd';
import Title from '../../../components/UI/Title/Title';
import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';
import SearchBox from '../../../components/UI/SearchBox/SearchBox';
import ErrorMsg from '../../../components/UI/ErrorMsg/ErrorMsg';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';


const checkProds = (oldProds, newProd) => {
    for(let i in oldProds){
        let oldP = oldProds[i];
        if( oldP.name.toLowerCase() === newProd.name.toLowerCase() && 
            oldP.type.toLowerCase() === newProd.type.toLowerCase() && 
            oldP.price === newProd.price &&
            oldP.currency === newProd.currency){
            let subtractedProd = {...oldP};
            let addedProd = {...oldP}
            subtractedProd[newProd.place] = (+oldP[newProd.place] - (+newProd.amount));
            addedProd[newProd.place] = (+oldP[newProd.place] + (+newProd.amount));
            return [
                i,
                {...subtractedProd},
                {...addedProd},
                newProd.place
            ]
        }
    }
    return null;
}


export class ChiqimHistory extends Component {
    state = {
        oldProds: null,
        oldHisProds: null,
        sortedArrProds: [],
        searchedProds: null,
        editInputs: null,
        editedProd: null,
        loading: true,
        error: null,
        showModal: false,
        msg: null
    }

    componentDidMount() {
        axios.get('/chiqimHistory.json')
            .then(res => {
                // Transform data into Arr
                let prods = {}
                for(let name in res.data){
                    prods[name] = {...res.data[name], id: name}
                }
                let prodsArr = Object.keys(prods)
                    .map(key => prods[key])
                // Sort by Date
                let sortedArrProds = prodsArr.sort((a, b) => {
                    a = new Date(a.date);
                    b = new Date(b.date);
                    return a>b ? -1 : a<b ? 1 : 0;
                });
                this.setState({sortedArrProds: sortedArrProds, oldHisProds: {...res.data}});
            })
            .catch(err => setTimeout(() => {
                this.setState({error: err, loading: false});
            }, 1000));
        axios.get('/products.json')
            .then(res => this.setState({oldProds: {...res.data}, loading: false}))
            .catch(err => this.setState({error: err, loading: false}))
    }

    closeModal = async () => {
        this.setState({showModal: false, wrongProd: false})
    }
    getStores = () => {
        let ombors = [];
        let konteners = [];
        for(let i=1; i<=6; i++) {
            ombors.push(
                <Input
                key={`store_${i}`} 
                id={`ChiqimHis_store_${i}`}
                type="radio" 
                label={`store_${i}`} 
                change={this.inputChangedHandler}/>
                )
            }
        for(let i=1; i<=16; i++) {
            konteners.push(
                <Input 
                key={`contener_${i}`} 
                id={`ChiqimHis_contener_${i}`}
                type="radio" 
                label={`contener_${i}`} 
                change={this.inputChangedHandler}/>
                )
            }
        return [ombors, konteners];
    }

    searchNameHandler = (e) => {
        let typeInput = document.querySelector('#ChiqimHistory__type').value.toLowerCase();
        let priceInput = document.querySelector('#ChiqimHistory__price').value;
        let dateInput = document.querySelector('#ChiqimHistory__date').value;
        let searchingProds = this.state.sortedArrProds;
        const prodsArr = searchingProds
            .filter(el => {
                let name = el.name.toLowerCase();
                let targetVal = e.target.value.toLowerCase();
                return name.includes(targetVal);
            })
            .filter(el => {
                let type = el.type.toLowerCase();
                return type.includes(typeInput)
            })
            .filter(el => {
                let price = el.price.toLowerCase();
                return price.includes(priceInput);
            })
            .filter(el => {
                let date = el.date;
                return date.includes(dateInput);
            });
        this.setState({searchedProds: prodsArr})
    }
    searchTypeHandler = (e) => {
        let nameInput = document.querySelector('#ChiqimHistory__name').value.toLowerCase();
        let priceInput = document.querySelector('#ChiqimHistory__price').value;
        let dateInput = document.querySelector('#ChiqimHistory__date').value;
        let searchingProds = this.state.sortedArrProds;
        const prodsArr = searchingProds
            .filter(el => {
                let type = el.type.toLowerCase();
                let targetVal = e.target.value.toLowerCase();
                return type.includes(targetVal);
            })
            .filter(el => {
                let name = el.name.toLowerCase();
                return name.includes(nameInput);
            })
            .filter(el => {
                let price = el.price.toLowerCase();
                return price.includes(priceInput);
            })
            .filter(el => {
                let date = el.date;
                return date.includes(dateInput);
            });
        this.setState({searchedProds: prodsArr})
    }
    searchPriceHandler = (e) => {
        let nameInput = document.querySelector('#ChiqimHistory__name').value.toLowerCase();
        let typeInput = document.querySelector('#ChiqimHistory__type').value.toLowerCase();
        let dateInput = document.querySelector('#ChiqimHistory__date').value;
        let searchingProds = this.state.sortedArrProds;
        const prodsArr = searchingProds
            .filter(el => {
                let price = el.price;
                let targetVal = e.target.value;
                return price.includes(targetVal);
            })
            .filter(el => {
                let name = el.name.toLowerCase();
                return name.includes(nameInput);
            })
            .filter(el => {
                let type = el.type.toLowerCase();
                return type.includes(typeInput);
            })
            .filter(el => {
                let date = el.date;
                return date.includes(dateInput);
            });
        this.setState({searchedProds: prodsArr})
    }
    searchDateHandler = (e) => {
        let nameInput = document.querySelector('#ChiqimHistory__name').value.toLowerCase();
        let typeInput = document.querySelector('#ChiqimHistory__type').value.toLowerCase();
        let priceInput = document.querySelector('#ChiqimHistory__price').value;
        let searchingProds = this.state.sortedArrProds;
        const prodsArr = searchingProds
            .filter(el => {
                let date = el.date;
                let targetVal = e.target.value;
                return date.includes(targetVal);
            })
            .filter(el => {
                let name = el.name.toLowerCase();
                return name.includes(nameInput);
            })
            .filter(el => {
                let type = el.type.toLowerCase();
                return type.includes(typeInput);
            })
            .filter(el => {
                let price = el.price;
                return price.includes(priceInput);
            });
        this.setState({searchedProds: prodsArr})
    }

    inputChangedHandler = (e) => {
        let product = {}
        if(e.target.type === 'radio') {
            product = {...this.state.editedProd}
            product.place = e.target.value.trim();
            return this.setState({editedProd: product})
        }
        switch(e.target.placeholder) {
            case 'Receiver': 
                product = {...this.state.editedProd}
                product.borrower = e.target.value.trim();
                return this.setState({editedProd: product})
            case 'Name': 
                product = {...this.state.editedProd}
                product.name = e.target.value.trim();
                return this.setState({editedProd: product})
            case 'Type': 
                product = {...this.state.editedProd}
                product.type = e.target.value.trim();
                return this.setState({editedProd: product})
            case 'Price': 
                product = {...this.state.editedProd}
                product.price = e.target.value.trim();
                return this.setState({editedProd: product})
            case 'Amount': 
                product = {...this.state.editedProd}
                product.amount = e.target.value.trim();
                return this.setState({editedProd: product})
            case 'Date': 
                product = {...this.state.editedProd}
                product.date = e.target.value.trim();
                return this.setState({editedProd: product})
            default: return null;
        }
    }
    priceSelectedHandler = (e) => {
        const product = {...this.state.editedProd}
        product.currency = e.target.value;
        this.setState({editedProd: product});
    }

    editHandler = async (prod) => { 
        document.querySelector('#ChiqimHis_borrower').value = prod.borrower;
        document.querySelector('#ChiqimHis_name').value = prod.name;
        document.querySelector('#ChiqimHis_type').value = prod.type;
        document.querySelector('#ChiqimHis_price').value = prod.price;
        document.querySelector('#ChiqimHis_amount').value = prod.amount;
        document.querySelector('#ChiqimHis_date').value = prod.date;
        document.querySelector(`#ChiqimHis_${prod.place}`).checked = true;
        let cur = prod.currency === "$" ? "usd" : "uzs"
        document.querySelector(`#ChiqimHis_${cur}`).selected = true; 

        this.setState({showModal: true, editedProd: {...prod}, nonEditedProd: {...prod}})      
    }

    hisChangedHandler = async () => {
        if(await checkProds(this.state.oldProds, this.state.editedProd) !== null) {
            //  Subtract Prev Amount From Given Product
            let [index, ,addedProd] = await checkProds(this.state.oldProds, this.state.nonEditedProd);
            let prevProducts = {...this.state.oldProds}
            prevProducts[index] = {...addedProd};
            
            // Add New Amount To Given Product
            let [i, subtructedProd, ,place] = await checkProds(prevProducts, this.state.editedProd);
            let newProducts = {...prevProducts}
            if(subtructedProd[place] >= 0) {
                newProducts[i] = {...subtructedProd};
                this.setState({oldProds: {...newProducts}, wrongProd: false})
                // Change /products
                axios.put('/products.json', newProducts)
                    .then(res => setTimeout(()=>window.location.reload(), 300))
                    .catch(err => this.setState({error: err}));
                // Change /historyProds
                axios.put(`/chiqimHistory/${this.state.editedProd.id}.json`, this.state.editedProd)
                    .then(res => this.setState({showModal: false}))
                    .catch(err => this.setState({error: err, showModal: false}));
            } else {
                newProducts = {...this.state.oldProds};
                this.setState({oldProds: {...newProducts}, wrongProd: true})
            }
        } else {
            let nonEditedProd = {...this.state.nonEditedProd}
            this.setState({wrongProd: true, editedProd: nonEditedProd})
        }
    }

    render() {
        const prods = this.state.searchedProds ? this.state.searchedProds : this.state.sortedArrProds;
        let hisProds = [];
        prods.forEach((prod, i) => {
            let hisProd = <HisProd 
                    key={prod.name + i} 
                    prod={prod}
                    editHandler={() => this.editHandler(prod)}
                    />
            hisProds.push(hisProd)
        });

        let ChiqimHistory = this.state.error ? <ErrorMsg>Connection Problem</ErrorMsg> : 
        <Fragment>
            <Modal 
                show={this.state.showModal}
                modalClosed={this.closeModal}>
                {this.state.wrongProd ? <h1>Incufficient Or Not Existing Product Etered</h1> :
                    <div className={classes.EditingField}>
                        <h2>Change The Incorrect Field!</h2>
                        <Input type="text" ph="Receiver" id="ChiqimHis_borrower" change={this.inputChangedHandler}/>
                        <Input type="text" ph="Name" id="ChiqimHis_name" change={this.inputChangedHandler}/>
                        <Input type="text" ph="Type" id="ChiqimHis_type" change={this.inputChangedHandler}/>
                        <div className={classes.Prices}>
                            <Input 
                                type="number" 
                                ph="Price" 
                                id="ChiqimHis_price" 
                                change={this.inputChangedHandler}/>
                            <Input 
                                type="select" 
                                id="ChiqimHis_currency" 
                                usdId="ChiqimHis_usd" 
                                uzsId="ChiqimHis_uzs"
                                change={this.priceSelectedHandler}/>
                        </div>
                        <Input type="number" ph="Amount" id="ChiqimHis_amount" change={this.inputChangedHandler}/>
                        <Input type="date" ph="Date" id="ChiqimHis_date" change={this.inputChangedHandler}/>
                        <h3>Joyi</h3>
                        <div className={classes.Stores}>
                            <div className={classes.Ombors}>{this.getStores()[0]}</div>
                            <div className={classes.Konteners}>{this.getStores()[1]}</div>
                        </div>
                        <button onClick={this.hisChangedHandler}>Save</button>
                    </div>
                }
            </Modal>
            <div className={classes.ChiqimHistory}>
                <Title>Output History</Title>
                <div className={classes.SearchBoxes}>
                    <SearchBox
                        type="text" 
                        id="ChiqimHistory__name"
                        onSearch={this.searchNameHandler} 
                        ph="Search By Name"/>
                    <SearchBox
                        type="text" 
                        id="ChiqimHistory__type"
                        onSearch={this.searchTypeHandler} 
                        ph="Search By Type"/>
                    <SearchBox
                        type="text" 
                        id="ChiqimHistory__price"
                        onSearch={this.searchPriceHandler} 
                        ph="Search By Price"/>
                    <SearchBox
                        type="text" 
                        id="ChiqimHistory__date"
                        ph="Search By Date"
                        onSearch={this.searchDateHandler}/>
                </div>
                <div className={classes.Titles}>
                    <span>Receiver: </span>
                    <span>Name: </span>
                    <span>Type: </span>
                    <span>Price: </span>
                    <span>Amount: </span>
                    <span>Spot: </span>
                    <span>Date: </span>
                    <span><i className="fas fa-cog"></i></span>
                </div>
                <div className={classes.ProdsContainer}>{hisProds}</div>
            </div>
        </Fragment>

        return this.state.loading ? <Spinner /> : ChiqimHistory
    }
}

export default ChiqimHistory