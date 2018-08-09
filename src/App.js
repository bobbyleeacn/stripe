import React, { Component } from 'react';
import './App.css';
import Tab from './Tab'
import TabList from './TabList'
import '@blueprintjs/core/lib/css/blueprint.css';

// this is master
export default class App extends Component {
  render() {
    return (
      <div className="Tablist">
        <TabList>
          <Tab title="checkout">
            Checkout panel
          </Tab>
          <Tab title="payments">
            Payments panel
          </Tab>
          <Tab title="disputes">
            Disputes panel
          </Tab>
        </TabList>
      </div>
    );
  }
}
