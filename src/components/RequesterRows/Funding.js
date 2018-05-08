import React, {Component} from 'react'
import {removeHouse} from '../../utils/firebase'
import firebase from 'firebase'

export default class TableRowFunding extends Component {

  constructor(props) {
    super(props)

    this.state = {
      row: props.row,
      i: props.i,
      id: props.id
    }
  }

  updateHouse() {
    var updates = {}
    var id = this.state.id

    var homeowner_id = this.state.row["homeowner_id"]
    var quote = this.state.row["quote"]
    var amount = this.state.row["amountRemaining"]
    var address  = this.state.row["address"]
    var city = this.state.row["city"]
    var price = this.state.row["price"]
    var state = this.state.row["state"]
    var zip = this.state.row["zip"]
    var daysRem = this.state.row["daysRemaining"]
    var updateData = {
      homeowner_id: homeowner_id,
      address: address,
      city: city,
      price: price,
      quote: quote,
      state: state,
      zip: zip,
      daysRemaining: daysRem,
      amountRemaining: amount,
      status: 4
    }
    updates['/houses/' + id] = updateData
    console.log(updates)
    var tempPlan = this.state.row
    tempPlan = updateData
    this.setState({row: tempPlan})
    return firebase.database().ref().update(updates)
  }

  //function for when a homeowner accepts the insurance quote. Will use the contract
  acceptQuote(){

    //TODO: Client should pay in this function
    //status needs to get changed and money needs to go into the contract
    this.updateHouse()
  }

  declineQuote() {
    removeHouse(this.state.id);
  }

  render() {
    return (
      <tr>
        <td key={this.state.row.address}>{this.state.row.address}</td>
        <td key={this.state.row.city}>{this.state.row.city}</td>
        <td key={this.state.row.state}>{this.state.row.state}</td>
        <td key={this.state.row.zip}>{this.state.row.zip}</td>
        <td key={this.state.row.price}>{this.state.row.price}</td>
        <td key={this.state.row.quote}>{this.state.row.quote}</td>
        <td key='remaining'>{this.state.row.amountRemaining}</td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-small has-background-success" id="confirm" disabled={!(this.state.row.amountRemaining === 0)} onClick={() => this.acceptQuote()}>
                <span className="icon">
                  <i className="fas fa-lg fa-check has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-small has-background-danger" id="confirm" disabled={!(this.state.row.amountRemaining === 0)} onClick={() => this.declineQuote()}>
                <span className="icon">
                  <i className="fas fa-lg fa-times has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}