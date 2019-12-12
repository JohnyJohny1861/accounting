import React, {Component, Fragment} from 'react'

import classes from './Product.css';
import Modal from '../../../components/UI/Modal/Modal';

const commas = (x) => {
  x = x.toString();
  let pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}

class Product extends Component {
  state = {
    showModal: false
  }

  openModal = () => {
    this.setState({showModal: true});
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  getStores = () => {
    let ombors = [];
    let konteners = [];
    for( let i=1; i<=6; i++) {
      ombors.push(
        <Fragment key={i}>
          {+this.props[`store_${i}`] > 0 ? 
            <div><strong>store-{i}:</strong> <span>{commas(this.props[`store_${i}`])}</span></div>
            : null}
        </Fragment>
      )
    }
    for( let i=1; i<=16; i++) {
      konteners.push(
        <Fragment key={i}>
          {+this.props[`contener_${i}`] > 0 ? 
            <div><strong>contener{i}:</strong> <span>{commas(this.props[`contener_${i}`])}</span></div>
            : null}
        </Fragment>
      )
    }
    return {ombors, konteners};
  }

  render() {
    let totalAmount = 0;
    for(let i=1; i<=6; i++) { totalAmount +=this.props[`store_${i}`] }
    for(let i=1; i<=16; i++) { totalAmount +=this.props[`contener_${i}`] }
    totalAmount = commas(totalAmount);

    return (
      <Fragment>
        <Modal 
            show={this.state.showModal}
            modalClosed={this.closeModal}>
                <div className={classes.Details}>
                  <div><strong>Name:</strong> <span>{this.props.name}</span></div>
                  <div><strong>Type:</strong> <span>{this.props.type}</span></div>
                  <div><strong>Price:</strong> <span>{this.props.price}</span></div>
                  <div><strong>Total Amount:</strong> <span>{totalAmount}</span></div>
                  {this.getStores().ombors}
                  {this.getStores().konteners}
                </div>
        </Modal>
        <div className={classes.Product}>
          <div onClick={this.openModal}>{this.props.name}</div>
          <div onClick={this.openModal}>{this.props.type}</div>
          <div onClick={this.openModal}>{this.props.price}</div>
          <div onClick={this.openModal}>{totalAmount}</div>
        </div>
      </Fragment>  
    )
  }
}

export default Product
