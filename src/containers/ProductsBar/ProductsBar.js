import React, { Component, Fragment } from 'react'

import classes from './ProductsBar.css'
import Product from './Product/Product';
import Title from '../../components/UI/Title/Title';
import SearchBox from '../../components/UI/SearchBox/SearchBox';

const commas = (x) => {
    x = x.toString();
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

export class ProductsBar extends Component {
    state = {
        searchedProds: null,
        loading: true,
        error: null,
        show: false
    }

    searchNameHandler = (e) => {
        let typeInput = document.querySelector('#ProductsBar__type').value.toLowerCase();
        let priceInput = document.querySelector('#ProductsBar__price').value.toLowerCase();
        let searchingProds = this.props.data;
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
            });
        this.setState({searchedProds: prodsArr})
    }

    searchTypeHandler = (e) => {
        let nameInput = document.querySelector('#ProductsBar__name').value.toLowerCase();
        let priceInput = document.querySelector('#ProductsBar__price').value.toLowerCase();
        let searchingProds = this.props.data;
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
            });
        this.setState({searchedProds: prodsArr})
    }

    searchPriceHandler = (e) => {
        let nameInput = document.querySelector('#ProductsBar__name').value.toLowerCase();
        let typeInput = document.querySelector('#ProductsBar__type').value.toLowerCase();
        let searchingProds = this.props.data;
        const prodsArr = searchingProds
            .filter(el => {
                let price = el.price.toLowerCase();
                let targetVal = e.target.value.toLowerCase();
                return price.includes(targetVal);
            })
            .filter(el => {
                let name = el.name.toLowerCase();
                return name.includes(nameInput);
            })
            .filter(el => {
                let type = el.type.toLowerCase();
                return type.includes(typeInput);
            });
        this.setState({searchedProds: prodsArr})
    }

    showModal = () => {
        this.setState({show: true})
    }

    closeModal = () => {
        this.setState({show: false})
    }

    render() {
        const prods = this.state.searchedProds ? this.state.searchedProds : this.props.data;
        let products = [];
        for(let i in prods) {
            let product = <Product 
                key={i}
                name={prods[i].name} 
                type={prods[i].type}
                price={`${commas(prods[i].price)} ${prods[i].currency}`} 
                store_1={+prods[i].store_1}
                store_2={+prods[i].store_2}
                store_3={+prods[i].store_3}
                store_4={+prods[i].store_4}
                store_5={+prods[i].store_5}
                store_6={+prods[i].store_6}
                contener_1={+prods[i].contener_1}
                contener_2={+prods[i].contener_2}
                contener_3={+prods[i].contener_3}
                contener_4={+prods[i].contener_4}
                contener_5={+prods[i].contener_5}
                contener_6={+prods[i].contener_6}
                contener_7={+prods[i].contener_7}
                contener_8={+prods[i].contener_8}
                contener_9={+prods[i].contener_9}
                contener_10={+prods[i].contener_10}
                contener_11={+prods[i].contener_11}
                contener_12={+prods[i].contener_12}
                contener_13={+prods[i].contener_13}
                contener_14={+prods[i].contener_14}
                contener_15={+prods[i].contener_15}
                contener_16={+prods[i].contener_16} />
            products.push(product);
        }
        let productsBar = <Fragment>
                <div className={classes.ProductsBar}>
                    <Title>{this.props.title}</Title>
                    <div className={classes.SearchBoxes}>
                        <SearchBox
                            type="text" 
                            id="ProductsBar__name"
                            onSearch={this.searchNameHandler} 
                            ph="Search By Name"/>
                        <SearchBox
                            type="text" 
                            id="ProductsBar__type"
                            onSearch={this.searchTypeHandler} 
                            ph="Search By Type"/>
                        <SearchBox
                            type="text" 
                            id="ProductsBar__price"
                            onSearch={this.searchPriceHandler} 
                            ph="Search By Price"/>
                    </div>
                    <div className={classes.Products}>
                        <h2>
                            <span>Name:</span>
                            <span>Type:</span>
                            <span>Price:</span>
                            <span>Total:</span>
                        </h2>
                        <div className={classes.Products_Wrapper}>{products}</div>
                    </div>
                </div>
                <div className={classes.TotalPrice}>
                    <h2>Total Price:</h2>
                    <div>
                        <h3>{this.props.totalUsd} $</h3>
                        <h3>{this.props.totalUzs} so'm</h3>
                    </div>
                </div>
            </Fragment>
        return productsBar
    }
}

export default ProductsBar