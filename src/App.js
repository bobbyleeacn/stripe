import React, { Component } from 'react';
import './App.css';
import Tab from './components/Tab'
import TabList from './components/TabList'
import Checkout from './components/Checkout'
import Payments from './components/Payments'
import Disputes from './components/Disputes'
import { withStripe } from './components/StripeApi'
import '@blueprintjs/core/lib/css/blueprint.css';


const publicKey = 'pk_test_AfqRos99rghht9D8wds486J5'  // used to request Token
const secretKey = 'sk_test_D6h6iSYpP1TojlrLCtR5rFdP'  // used to make a charge


export default class App extends Component {
constructor(props) {
  super(props)
  this.state = {
     refresh: false,
  }
  this.refresh = this.refresh.bind(this)
}

refresh() {
  this.setState({refresh: !this.state.refresh})
}

  render() {
    const SuperCheckout = withStripe(Checkout, publicKey, secretKey, this.state.refresh)
    const SuperPayments = withStripe(Payments, publicKey, secretKey, this.state.refresh)
    const SuperDisputes = withStripe(Disputes, publicKey, secretKey, this.state.refresh)
    return (
      <div className="Tablist">
        <TabList refresh={this.refresh}>
          <Tab title="checkout">
            <SuperCheckout />
          </Tab>
          <Tab title="payments">
            <SuperPayments />
          </Tab>
          <Tab title="disputes">
            <SuperDisputes />
          </Tab>
        </TabList>
        
      </div>
    );
  }
}
