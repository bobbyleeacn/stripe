import React, { Component } from "react";

export default class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      hideRefundData: true,
      refundData: null
    };
  }

  componentDidMount() {
    this.getPayments();
  }

  getPayments() {
    this.setState({ loading: true });
    this.props.getSecret("charges").then(data => {
      this.setState({
        data: data.data,
        loading: false
      });
    });
  }

  handleRefundData(refundData) {
    this.setState({ hideRefundData: false, refundData: refundData });
  }

  render() {
    let refundData = "";
    const payments = this.state.data.map(payment => (
      <Payment
        {...this.props}
        payment={payment}
        key={payment.id}
        handleRefundData={refundData => this.handleRefundData(refundData)}
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
        {this.state.hideRefundData ? null : refundData}
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
      refundData: refundData,
      loading: false
    });

    this.props.handleRefundData(this.state.refundData);
  }

  render() {
    const {id, amount, refunded, dispute, refundReason, currency} = this.props.payment
    let str = amount.toString()
    const amountConverted = (str.slice(0, (str.length - 2)) + '.' + str.slice(str.length - 2))
    return (
      <tr>
        <td style={{width:270}}>{id}</td>
        <td style={{width:100}}> {(currency==='usd') ? '$' + amountConverted : amount/100 + ' vnd'}</td>
        <td style={{width:100}}>{refunded.toString()}</td>
        <td style={{width:70}}>{(dispute != null).toString()}</td>
        <td>{refundReason}</td>
        <td>
          <button
            disabled={refunded || dispute}
            onClick={() => this.postRefund(id)}
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
      {props.error ? <div><p>Error Message: {props.error.message}</p><p>Type: {props.error.type}</p></div> : null}
    </div>
  );
};
