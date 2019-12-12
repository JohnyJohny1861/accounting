import React, {Fragment, Component} from 'react'

import Modal from '../../components/UI/Modal/Modal';

const  withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
      constructor(props) {
        super(props);
        this.reqInterceptors = axios.interceptors.request.use(req => {
        setTimeout(() => {
            this.setState({error: null});
        }, 1000);
        return req;
        });

        this.resInterceptors = axios.interceptors.response.use(res => res, error => {
            setTimeout(() => {
                this.setState({error: error});
            }, 1000);
        })
      }
      state = {
          error: null
      }

      errorConfirmed = () => {
          this.setState({error: null});
      }

      render() {
        axios.interceptors.request.eject(this.reqInterceptors);
        axios.interceptors.response.eject(this.resInterceptors);
          return (
            <Fragment>
                <Modal 
                    show={this.state.error}
                    modalClosed={this.errorConfirmed}>{this.state.error ? this.state.error.message : null}</Modal>
                <WrappedComponent {...this.props}/>
            </Fragment>
            )
      }
  }
}

export default withErrorHandler;