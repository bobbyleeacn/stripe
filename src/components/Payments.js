import React, { Component } from "react";

export default class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      showRefundData: true,
      refundData: null
    };
  }

  componentDidMount() {
    this.getPayments2();
  }

  getPayments2() {
    this.setState({ loading: true });
    this.props.getSecret("charges").then(data => {
      this.setState({
        data: data.data,
        loading: false
      });
    });
  }

  showRefundData(refundData) {
    this.setState({ showRefundData: false, refundData: refundData });
  }

  render() {
    let refundData = "";
    const payments = this.state.data.map(payment => (
      <Payment
        {...this.props}
        payment={payment}
        key={payment.id}
        showRefundData={refundData => this.showRefundData(refundData)}
      />
    ));
    if (this.state.refundData) {
      refundData = <Refund {...this.state.refundData} />;
    }
    return (
      <div>
        <div>
          <h2>Payments</h2>
          {this.state.loading ? <div>Loading...</div> : null}
          <table>
            <thead>
              <tr>
                <td>Id</td>
                <td>Amount</td>
                <td>Refunded</td>
                <td>Disputed</td>
                <td></td>
              </tr>
            </thead>
            <tbody>{payments}</tbody>
          </table>
        </div>
        {this.state.showRefundData ? null : refundData}
      </div>
    );
  }
}

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refundData: ""
    };
  }

  async postRefund(chargeID) {
    this.setState({
      loading: true
    });
    const refundData = await this.props.postSecret("refunds", {
      charge: chargeID
    });
    console.log("refundData is ", refundData);

    this.setState({
      refundData: refundData, // refund data setState not working
      loading: false
    });

    this.props.showRefundData(this.state.refundData);
  }

  render() {
    return (
      <tr>
        <td>{this.props.payment.id}</td>
        <td>{this.props.payment.amount}</td>
        <td>{this.props.payment.refunded.toString()}</td>
        <td>{(this.props.payment.dispute != null).toString()}</td>
        <td>{this.props.payment.refundReason}</td>
        <td>
          <button
            disabled={this.props.payment.refunded || this.props.payment.dispute}
            onClick={() => this.postRefund(this.props.payment.id)}
          >
            refund
          </button>
        </td>
      </tr>
    );
  }
}

const Refund = props => {
  return (
    <div>
      <h2> Refund Information </h2>
      <p>Refund ID: {props.id}</p>
      <p>Charge ID: {props.charge}</p>
      <p>Amount: {props.amount}</p>
      <p>Status Message: {props.status}</p>
    </div>
  );
};
