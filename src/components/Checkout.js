import React, { Component } from "react";
import CreditCardInput from "react-credit-card-input";

export default class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestCharge: null,
      cardNum: null,
      cardExpMo: null,
      cardExpYr: null,
      chargeAmount: null,
      status: null,
      errorMessage: null,
      currency: 'usd',
    };
    this.createCharge = this.createCharge.bind(this);
  }

  async createCharge() {
    const creditCardDetails = {
      "card[number]": this.state.cardNum,
      "card[exp_month]": this.state.cardExpMo,
      "card[exp_year]": this.state.cardExpYr,
    };

    this.setState({
      latestCharge: "Creating token.."
    });

    const tokenData = await this.props.postPublic("tokens", creditCardDetails);
    this.setState({
      latestCharge: "Creating charge"
    });

    const chargeData = await this.props.postSecret("charges", {
      amount: this.state.chargeAmount,
      currency: this.state.currency,
      description: "test charge",
      source: tokenData.id
    });
    console.log(chargeData);
    this.setState({
      latestCharge: chargeData.id,
      status: chargeData.status,
    });

    if (chargeData.error) {
      this.setState({status: chargeData.error.message, latestCharge: chargeData.error.charge})
      }
    }

  render() {
    return (
      <div>

        <h2>Enter Credit Card Details:</h2>
        <div><select onChange={(e)=>this.setState({currency:e.target.value})}><option value='usd'>usd</option><option value='vnd'>vnd</option></select></div><br />
        <CreditCardInput
          containerStyle={{
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "#eaeaea"
          }}
          cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
            <input
              {...props}
              onChange={handleCardCVCChange(e =>
                console.log("cvc change", e.target.value)
              )}
            />
          )}
          cardExpiryInputRenderer={({ handleCardExpiryChange, props }) => (
            <input
              {...props}
              onChange={handleCardExpiryChange(e =>
                this.setState({
                  cardExpMo: e.target.value.substring(0, 2),
                  cardExpYr: "20" + e.target.value.substring(5, 7)
                })
              )}
            />
          )}
          cardNumberInputRenderer={({ handleCardNumberChange, props }) => (
            <input
              {...props}
              onChange={handleCardNumberChange(e =>
                this.setState({ cardNum: e.target.value.split(" ").join("") })
              )}
            />
          )}
        />

        <div>
          <br />
          <input
            type="text"
            style={{ height: 35, width:315, fontSize: 14 }}
            placeholder="          Amount"
            onChange={e => this.setState({ chargeAmount: e.target.value * 100 })}
          />
          <button
            style={{ height: 33, paddingTop: 2, }}
            onClick={this.createCharge}
            
          >
            Submit{" "}
          </button>
        </div>
       <br /><br />
        <p>Charge ID :  <b>{this.state.latestCharge}</b></p>
        <p>Status Message :  <b>{this.state.status} </b></p>
    
     
      </div>
    );
  }
}
