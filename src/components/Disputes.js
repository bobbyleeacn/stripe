import React, { Component } from "react";

export default class Disputes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    };
    this.getDisputes = this.getDisputes.bind(this);
  }

  componentDidMount() {
    this.getDisputes();
  }

  async getDisputes() {
    this.setState({
      loading: true
    });
    const disputesData = await this.props.getSecret("disputes");
    this.setState({
      data: disputesData.data,
      loading: false
    });
  }

  render() {
    const disputes = this.state.data.map(dispute => (
      <Dispute dispute={dispute} key={dispute.id} />
    ));
    return (
      <div>
        <div>
          <h2>Disputes</h2>
          {this.state.loading ? <div>Loading...</div> : null}
          <table>
            <thead>
              <tr>
                <td>Charge Id</td>
                <td>Amount</td>
                <td>Reason</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>{disputes}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

class Dispute extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <tr>
        <td>{this.props.dispute.charge}</td>
        <td>{this.props.dispute.amount}</td>
        <td>{this.props.dispute.reason}</td>
        <td>{this.props.dispute.status}</td>
      </tr>
    );
  }
}
