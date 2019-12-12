import React, { Component, Fragment } from 'react';

import classes from './App.css';
import Spinner from './components/UI/Spinner/Spinner';
import Modal from './components/UI/Modal/Modal';
import ErrorMsg from './components/UI/ErrorMsg/ErrorMsg';
import Input from './components/UI/Input/Input';
import Layout from './hoc/Layout/Layout';
import ProductsBar from './containers/ProductsBar/ProductsBar';
import AddProduct from './containers/AddProduct/AddProduct';
import RemoveProduct from './containers/RemoveProduct/RemoveProduct';
import Kirdi from './containers/Kirim/Kirdi/Kirdi';
import KirimHistory from './containers/Kirim/KirimHistory/KirimHistory';
import Chiqdi from './containers/Chiqim/Chiqdi/Chiqdi';
import ChiqimHistory from './containers/Chiqim/ChiqimHistory/ChiqimHistory';
import { Route, Switch } from 'react-router-dom';
import axios from './axios-orders';


const prodTotAmount = (prod) => {
  let totalAmount = 0;
  for(let i=1; i<=6; i++) { totalAmount += +prod[`store_${i}`] }
  for(let i=1; i<=16; i++) { totalAmount += +prod[`contener_${i}`] }
  return totalAmount;
}
const commas = (x) => {
  x = x.toString();
  let pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}
const getProds = (products, storeName=null) => {
  let prods = [];
  if(storeName === null) {
    for(let i in products) {
      prods.push({...products[i], id: i})
    }
  } else {
    for(let i in products) {
      if(products[i][storeName] > 0) {
        prods.push({...products[i], id: i})
      }
    }
  }

  // Total USD and UZS 
  let totalUsd = prods
    .map(el => el.currency === '$' ? +el.price * prodTotAmount(el) : null)
    .reduce((sum, usd) => sum+usd, 0);
  totalUsd = commas(totalUsd);
  let totalUzs = prods
    .map(el => el.currency === "so'm" ? +el.price * prodTotAmount(el) : null)
    .reduce((sum, usd) => sum+usd, 0);
  totalUzs = commas(totalUzs);

  // Sort Prods by NAME
  let namesArr = prods.map(el => el.name).sort();
  let sortedArr = [];
  namesArr.forEach(name => {
      prods.forEach(obj => {
          if(obj.name === name) {
              let newObj = {...obj, totalUsd}
              sortedArr.push(newObj);
              obj.name = '';
          }
      })
  })
  return sortedArr.length > 0 ? {sortedArr, totalUsd, totalUzs} : null
}


class App extends Component {
  state = {
    loading: true,
    showModal: false,
    msg: null,
    loginInp: '',
    parolInp: '',
    auth: false,
    realLogin: 'aaa',
    realParol: '111',
    productsFromBase: null,
    allProds: null,
    error: null
  }
  componentDidMount () {
    axios.get('/products.json')
      .then(res => {
        let login = sessionStorage.getItem('login');
        let parol = sessionStorage.getItem('parol');

        this.setState({
          loading: false,
          auth: this.state.realLogin === login && this.state.realParol === parol,
          allProds: {...getProds(res.data)},
          store_1: {...getProds(res.data, 'store_1')},
          store_2: {...getProds(res.data, 'store_2')},
          store_3: {...getProds(res.data, 'store_3')},
          store_4: {...getProds(res.data, 'store_4')},
          store_5: {...getProds(res.data, 'store_5')},
          store_6: {...getProds(res.data, 'store_6')},
          contener_1: {...getProds(res.data, 'contener_1')},
          contener_2: {...getProds(res.data, 'contener_2')},
          contener_3: {...getProds(res.data, 'contener_3')},
          contener_4: {...getProds(res.data, 'contener_4')},
          contener_5: {...getProds(res.data, 'contener_5')},
          contener_6: {...getProds(res.data, 'contener_6')},
          contener_7: {...getProds(res.data, 'contener_7')},
          contener_8: {...getProds(res.data, 'contener_8')},
          contener_9: {...getProds(res.data, 'contener_9')},
          contener_10: {...getProds(res.data, 'contener_10')},
          contener_11: {...getProds(res.data, 'contener_11')},
          contener_12: {...getProds(res.data, 'contener_12')},
          contener_13: {...getProds(res.data, 'contener_13')},
          contener_14: {...getProds(res.data, 'contener_14')},
          contener_15: {...getProds(res.data, 'contener_15')},
          contener_16: {...getProds(res.data, 'contener_16')}
        })
      })
      .catch(err => {
        this.setState({error: err, loading: false})
        console.log(err)
      })
  }

  closeModal = () => {
    this.setState({showModal: false});
  }

  inputChangedHandler = (e) => {
    switch(e.target.placeholder) {
        case 'Login':
          return this.setState({loginInp: e.target.value.trim()})
        case 'Password':
          return this.setState({parolInp: e.target.value.trim()})
        default: return null;
    }
  }

  loginHandler = () => {
    if(this.state.loginInp.toLowerCase() === this.state.realLogin.toLowerCase() &&
       this.state.parolInp.toLowerCase() === this.state.realParol.toLowerCase() ) {
        this.setState({auth: true})
        sessionStorage.setItem('login', this.state.realLogin.toLowerCase());
        sessionStorage.setItem('parol', this.state.realParol.toLowerCase());
    } else {
      this.setState({
        auth: false, 
        msg: "Wrong Login Or Password",
        showModal: true
      })
    }
  }

  getStores = () => {
    let ombors= [];
    for(let i = 1; i <= 6; i++) {
      ombors.push(
        <Route 
          key={i}
          path={`/ombor_${i}`}
          render={
            () => <ProductsBar 
              title={`Store-${i}`}
              totalUsd={this.state[`store_${i}`].totalUsd}
              totalUzs={this.state[`store_${i}`].totalUzs}
              data={this.state[`store_${i}`].sortedArr}/>
          }/>
      )
    }
    let konteners= [];
    for(let i = 1; i <= 16; i++) {
      konteners.push(
        <Route 
          key={i}
          path={`/kontener_${i}`} 
          render={
            () => <ProductsBar 
              title={`Contener-${i}`}
              totalUsd={this.state[`contener_${i}`].totalUsd}
              totalUzs={this.state[`contener_${i}`].totalUzs}
              data={this.state[`contener_${i}`].sortedArr}
              />}/>
      )
    }
    return {ombors, konteners};
  }

  render() {
    
    let layout = (<Layout>
        <Switch>
          <Route path="/add" render={() => <AddProduct allProds={this.state.allProds.sortedArr} />} />
          <Route path="/remove" component={RemoveProduct} />
          <Route path="/kirdi" component={Kirdi} />
          <Route path="/kirimTarixi" component={KirimHistory} />
          <Route path="/chiqdi" component={Chiqdi} />
          <Route path="/chiqimTarixi" component={ChiqimHistory} />
          <Route path="/" exact render={
            () => <ProductsBar 
              title="All Products"
              totalUsd={this.state.allProds.totalUsd}
              totalUzs={this.state.allProds.totalUzs}
              data={this.state.allProds.sortedArr}/>
            }/>
          {this.getStores().ombors}
          {this.getStores().konteners}
        </Switch>
      </Layout>
    )
    let auth = (
      <Fragment>
        <Modal 
            show={this.state.showModal}
            modalClosed={this.closeModal}>
                <h1>{this.state.msg}</h1>
        </Modal>
        <div className={classes.Auth}>
          <Input type="text" ph="Login" change={this.inputChangedHandler}/>
          <Input type="password" ph="Password" change={this.inputChangedHandler}/>
          <Input type="submit" clicked={this.loginHandler}>Log In</Input>
        </div>
      </Fragment>
    )

    let app = this.state.error ? <ErrorMsg>Connection Problem</ErrorMsg> :
      <div className={classes.App}>
        {
          this.state.auth ? layout : auth
        }
      </div>
    return (
      this.state.loading ? <Spinner /> : app
    );
  }
}

export default App;
