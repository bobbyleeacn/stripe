import React, { Component } from 'react'

export default class Payments extends Component {
  constructor(props) {
    super(props)
    this.state = {
       data: [],
       loading: false,
       showRefundData: true,
    }
    //this.getPayments = this.getPayments.bind(this)
  }

  componentDidMount() {
    this.getPayments2();
  }

  // async getPayments() {
  //   this.setState({
  //     loading: true,
  //   })
  //   const chargesData = await this.props.getSecret('charges')
  //   this.setState({
  //     data: chargesData.data,
  //     loading: false,
  //   })
  // }

  getPayments2() {
    this.setState({loading: true,})
    this.props.getSecret('charges')
    .then(data => {
      this.setState({
        data: data.data,
        loading: false,
      });
    });
  }


  showRefundData() {
    console.log('showRefundData pressed with ')
    this.setState({showRefundData: false})
  }
    

  
  render() {
    // {this.state.showRefundData ? null : <Refund value='blue'/>}
  const payments = this.state.data.map(payment => <Payment {...this.props} payment={payment} key={payment.id} showRefundData={()=>this.showRefundData()}/>);
    return (
      <div>
        <button onClick={()=> this.setState({showRefundData: !this.showRefundData})}>click to toggle</button>
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
                <td>Refund</td>
              </tr>
            </thead>
            <tbody> 
              {payments}
            </tbody>
          </table>
        </div>
        {this.state.showRefundData ? null : <Refund value='blue'/>}
      </div>
      
    )
  }
}

class Payment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       loading: false,
       refundData: null,
    }
  }
  
  async postRefund(chargeID) {
    console.log('postRefund triggered')
    this.setState({
      loading: true,
    })
    const refundData = await this.props.postSecret('refunds', {charge: chargeID})
    console.log('refundData is ', refundData);
    
    this.setState({
      refundData: refundData,   // refund data setState not working - try using .then syntax
      loading: false,
    })
  }


  render() {
    return (
      <tr>
        <td>{this.props.payment.id}</td>
        <td>{this.props.payment.amount}</td>
        <td>{this.props.payment.refunded.toString()}</td>
        <td>{(this.props.payment.dispute != null).toString()}</td>
        <td>{this.props.payment.refundReason}</td>
        <td><button disabled={this.props.payment.refunded || this.props.payment.dispute} onClick={()=> {this.postRefund(this.props.payment.id); this.props.showRefundData()} } >refund</button></td>
      </tr>
       
    )
  }
}


const Refund = (props) => {
  
  
  
  return (
    <div>
      Refund Data Here {props.value}
    </div>
  )
}



// ()=> this.postRefund(this.props.payment.id)   // onClick for the refund button
