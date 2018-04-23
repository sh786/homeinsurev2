import React, {Component} from 'react'
import {writeHouseData} from '../utils/firebase'

export default class RequestInsure extends Component {

  //checks if valid address. NEEDS TO BE ADJUSTED
  isValidData(address, city, state, zip, price) {
    if (address && city && state && zip && price) {
      return true
    } else {
      return false
    }
  }

  setHouse() {
    let address = this.refs.address.value
    let city = this.refs.city.value
    let state = this.refs.state.value
    let zip = this.refs.zip.value
    let price = this.refs.price.value
    console.log("writing to database")
    if (this.isValidData(address, city, state, zip, price)) {
      writeHouseData(address, city, state, zip, price)
    }
  }

  render() {
    return (
      <div>
        <div className="container request-form">
          <h1 className="title">Request Insurance</h1>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input className="input" type="text" placeholder="Name" id="name"/>
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left has-icons-right">
              <input className="input" type="email" id="email" placeholder="Email input"/>
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <label className="label">Address</label>
          <div className="field is-grouped">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Street Address"
                ref="address"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="City" ref="city"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="State Abbr." ref="state"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="Zip" ref="zip"/>
            </div>
            <div className="control">
              <input
                className="input"
                type="integer"
                placeholder="Price of House"
                ref="price"/>
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button
                className="button is-link"
                ref="submit"
                onClick={this
                .setHouse
                .bind(this)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}