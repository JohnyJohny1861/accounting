import React, { Component, Fragment } from 'react'

import classes from './KirimHistory.css';
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
                {...addedProd}
            ]
        }
    }
    return null;
}


export class KirimHistory extends Component {
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
        axios.get('/kirimHistory.json')
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
                id={`KirimHis_store_${i}`}
                type="radio" 
                label={`store_${i}`} 
                change={this.inputChangedHandler}/>
                )
            }
        for(let i=1; i<=16; i++) {
            konteners.push(
                <Input 
                key={`contener_${i}`} 
                id={`KirimHis_contener_${i}`}
                type="radio" 
                label={`contener_${i}`} 
                change={this.inputChangedHandler}/>
                )
            }
        return [ombors, konteners];
    }

    searchNameHandler = (e) => {
        let typeInput = document.querySelector('#KirimHistory__type').value.toLowerCase();
        let priceInput = document.querySelector('#KirimHistory__price').value;
        let dateInput = document.querySelector('#KirimHistory__date').value;
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
        let nameInput = document.querySelector('#KirimHistory__name').value.toLowerCase();
        let priceInput = document.querySelector('#KirimHistory__price').value;
        let dateInput = document.querySelector('#KirimHistory__date').value;
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
        let nameInput = document.querySelector('#KirimHistory__name').value.toLowerCase();
        let typeInput = document.querySelector('#KirimHistory__type').value.toLowerCase();
        let dateInput = document.querySelector('#KirimHistory__date').value;
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
        let nameInput = document.querySelector('#KirimHistory__name').value.toLowerCase();
        let typeInput = document.querySelector('#KirimHistory__type').value.toLowerCase();
        let priceInput = document.querySelector('#KirimHistory__price').value;
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
        document.querySelector('#KirimHis_name').value = prod.name;
        document.querySelector('#KirimHis_type').value = prod.type;
        document.querySelector('#KirimHis_price').value = prod.price;
        document.querySelector('#KirimHis_amount').value = prod.amount;
        document.querySelector('#KirimHis_date').value = prod.date;
        document.querySelector(`#KirimHis_${prod.place}`).checked = true;
        let cur = prod.currency === "$" ? "usd" : "uzs"
        document.querySelector(`#KirimHis_${cur}`).selected = true; 

        this.setState({showModal: true, editedProd: {...prod}, nonEditedProd: {...prod}})      
    }

    hisChangedHandler = async () => {
        console.log(this.state.editedProd);
        if(await checkProds(this.state.oldProds, this.state.editedProd) !== null) {
            //  Subtract Prev Amount From Given Product
            let [index, subtractedProd] = await checkProds(this.state.oldProds, this.state.nonEditedProd);
            let prevProducts = {...this.state.oldProds}
            prevProducts[index] = {...subtractedProd};
            
            // Add New Amount To Given Product
            let [i, ,addedProd] = await checkProds(prevProducts, this.state.editedProd);
            let newProducts = {...prevProducts}
            newProducts[i] = {...addedProd};

            // Change /products
            this.setState({oldProds: {...newProducts}, wrongProd: false})
            axios.put('/products.json', newProducts)
                .then(res => setTimeout(()=>window.location.reload(), 300))
                .catch(err => this.setState({error: err}));

            // Change /historyProds
            axios.put(`/kirimHistory/${this.state.editedProd.id}.json`, this.state.editedProd)
                .then(res => this.setState({showModal: false}))
                .catch(err => this.setState({error: err, showModal: false}));
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
                    deleteHandler={() => this.deleteHandler(prod.id)}
                    />
            hisProds.push(hisProd)
        });

        let kirimHistory = this.state.error ? <ErrorMsg>Connection Problem</ErrorMsg> : 
        <Fragment>
            <Modal 
                show={this.state.showModal}
                modalClosed={this.closeModal}>
                {this.state.wrongProd ? <h1>Product Does Not Exist</h1> :
                    <div className={classes.EditingField}>
                        <h2>Change The Incorrect Field!</h2>
                        <Input type="text" ph="Name" id="KirimHis_name" change={this.inputChangedHandler}/>
                        <Input type="text" ph="Type" id="KirimHis_type" change={this.inputChangedHandler}/>
                        <div className={classes.Prices}>
                            <Input 
                                type="number" 
                                ph="Price" 
                                id="KirimHis_price" 
                                change={this.inputChangedHandler}/>
                            <Input 
                                type="select" 
                                id="KirimHis_currency" 
                                usdId="KirimHis_usd" 
                                uzsId="KirimHis_uzs"
                                change={this.priceSelectedHandler}/>
                        </div>
                        <Input type="number" ph="Amount" id="KirimHis_amount" change={this.inputChangedHandler}/>
                        <Input type="date" ph="Date" id="KirimHis_date" change={this.inputChangedHandler}/>
                        <h3>Joyi</h3>
                        <div className={classes.Stores}>
                            <div className={classes.Ombors}>{this.getStores()[0]}</div>
                            <div className={classes.Konteners}>{this.getStores()[1]}</div>
                        </div>
                        <button onClick={this.hisChangedHandler}>Saqlash</button>
                    </div>
                }
            </Modal>
            <div className={classes.KirimHistory}>
                <Title>Kirim Tarixi</Title>
                <div className={classes.SearchBoxes}>
                    <SearchBox
                        type="text" 
                        id="KirimHistory__name"
                        onSearch={this.searchNameHandler} 
                        ph="Search By Name"/>
                    <SearchBox
                        type="text" 
                        id="KirimHistory__type"
                        onSearch={this.searchTypeHandler} 
                        ph="Search By Type"/>
                    <SearchBox
                        type="text" 
                        id="KirimHistory__price"
                        onSearch={this.searchPriceHandler} 
                        ph="Search By Price"/>
                    <SearchBox
                        type="text" 
                        id="KirimHistory__date"
                        ph="Search By Date"
                        onSearch={this.searchDateHandler}/>
                </div>
                <div className={classes.Titles}>
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

        return this.state.loading ? <Spinner /> : kirimHistory
    }
}

export default KirimHistory