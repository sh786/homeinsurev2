import React, {Component} from 'react'
import {removeHouse} from '../../utils/firebase'
import firebase from 'firebase'

export default class TableRowActive extends Component {

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
      status: 5
    }
    updates['/houses/' + id] = updateData
    var tempPlan = this.state.row
    tempPlan = updateData
    this.setState({row: tempPlan})
    return firebase.database().ref().update(updates)
  }

  fileClaim(){
    this.updateHouse()
  }

  render() {
    return (
      <tr>
        <td key="address">{this.state.row.address}</td>
        <td key="city">{this.state.row.city}</td>
        <td key="state">{this.state.row.state}</td>
        <td key="zip">{this.state.row.zip}</td>
        <td key="price">{this.state.row.price}</td>
        <td key="quote">{this.state.row.quote}</td>
        <td>Sam Hamburger</td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-small has-background-warning" id="decline" onClick={() => this.fileClaim()}>
                <span className="icon">
                  <i className="fas fa-lg fa-exclamation-triangle has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}