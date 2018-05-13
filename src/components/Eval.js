import React, {Component} from 'react'
import firebase from 'firebase'

import {hash} from '../utils/firebase'

import InsuranceContract from '../../build/contracts/Insurance.json'
import getWeb3 from '../utils/getWeb3'

const snapshotToArray = snapshot => Object
  .entries(snapshot)
  .map(e => Object.assign(e[1], {key: e[0]}));

import ClaimRow from './EvaluatorRows/ClaimRow'

class TableRow extends Component {

  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      //parent: props.parent,
      insurancePlans: props.plans,
      ids: props.ids,
      inputValue: "",
      row: props.row,
      i: props.i,
      myweb3: props.myweb3,
      insuranceInstance: props.insuranceInstance,
    }
    console.log(this.state)
  }

  updateInputValue(evt) {
    this.setState({inputValue: evt.target.value})
    //console.log(this.state.inputValue)
  }

  getAverage(quotes) {
    console.log(quotes)
    var acc = 0
    for (var i = 0; i < quotes.length; i++) {
      if (quotes[i] != "") {
        acc += Number(quotes[i])
      }
    }
    console.log(acc)
    var ret = (acc / quotes.length).toString()
    return ret
  }

  addClient(_house_token, _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend) {
    var insuranceInstance

    this
      .state
      .myweb3
      .eth
      .getAccounts((error, accounts) => {
        this.state.insuranceInstance
          .deployed()
          .then((instance) => {
            console.log(instance)
            insuranceInstance = instance
            
            console.log('adding a house with house_token' + _house_token)
            return insuranceInstance.add_house_for_client(_house_token, {from: accounts[0]})
          })
          .then((result) => {
              console.log(result)
            // Get the value from the contract to prove it worked.
            return insuranceInstance
              .get_address_to_house_tokens
              .call(accounts[0])
          })
          //.then(sleep(1000))
          .then((result) => {
            console.dir(result)
          })
          .then((result) => {
            this.addEvaluation(_house_token, _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend)
          })
      })

      // this.addEvaluation(_house_token, _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend)
  }

  addEvaluation(_house_token, _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend) {
    var insuranceInstance
    // Get accounts.
    this
      .state
      .myweb3
      .eth
      .getAccounts((error, accounts) => {
        this.state.insuranceInstance
          .deployed()
          .then((instance) => {
            this.state.myweb3.eth.defaultAccount = accounts[0]
            insuranceInstance = instance

            console.log('Adding evaluator and house pricing info to house token')
            return insuranceInstance.add_evaluation(_house_token,
                _total_to_insure, _yearly_payment, _yearly_stakeholder_dividend, {from: accounts[0]})
          })
          .then((result) => {
            console.log('transaction completed')
            // Get the value from the contract to prove it worked.
            return insuranceInstance
              .get_yearly_stakeholder_dividend
              .call(_house_token)
          })
          //.then(sleep(1000))
          .then((result) => {
            console.log('stakeholder dividend')
            console.dir(result)
            // console.dir(result[0])
            // console.dir(result[0].c)

            // console.dir(result[0].c[0])
            //console.dir(result.c)
            //let house_id = result.c[0]
            //console.log(house_id)
            // Update state with the result.
            //return this.setState({userHouseTokens: result.c[0]})
          })
      })
  }



  //quote comes in in units of ether 
  updateHouse(index, quote) {
    var updates = {}
    var id = this.state.ids[index]

    var newQuote = quote
    var address = this.state.insurancePlans[index]["address"]
    var city = this.state.insurancePlans[index]["city"]
    var price = this.state.insurancePlans[index]["price"]
    var state = this.state.insurancePlans[index]["state"]
    var zip = this.state.insurancePlans[index]["zip"]
    var h_id = this.state.insurancePlans[index]["homeowner_id"]
    var amountRemaining = this.state.insurancePlans[index]["amountRemaining"]
    var updateData = {
      address: address,
      city: city,
      price: price,
      quote: newQuote,
      state: state,
      zip: zip,
      homeowner_id: h_id,
      status: 2,
      amountRemaining: amountRemaining
    }
    updates['/houses/' + id] = updateData
    var temp = this.state.insurancePlans
    temp[index] = updateData
    this.setState({insurancePlans: temp})


    var house_token = hash(id)
    console.log('house token ' + house_token)
    console.log('id ' + id)
    var quote_as_int = parseInt(quote)

    console.log(this.state.myweb3)
    var quote_as_bignumber = this.state.myweb3.toBigNumber(quote_as_int)

    var stakeholder_dividend = quote_as_bignumber.times(0.95)


    var price_as_int = parseInt(price)
    var price_as_bignumber = this.state.myweb3.toBigNumber(price_as_int)
    // console.log('price' + price_as_bignumber)
    // console.log('quote' + quote_as_bignumber)
    // console.log('stakeholder_dividend' + stakeholder_dividend)
    console.log('price' + this.state.myweb3.toWei(price_as_bignumber, 'ether'))
    console.log('quote' + this.state.myweb3.toWei(quote_as_bignumber, 'ether'))
    console.log('stakeholder_dividend' + this.state.myweb3.toWei(stakeholder_dividend, 'ether'))

    //asynchronous code fucking me over
    this.addClient(house_token, this.state.myweb3.toWei(price_as_bignumber, 'ether'), 
        this.state.myweb3.toWei(quote_as_bignumber, 'ether'), this.state.myweb3.toWei(stakeholder_dividend, 'ether'))
    // this.addEvaluation(house_token, this.state.myweb3.toWei(price_as_bignumber, 'ether'), 
    //     this.state.myweb3.toWei(quote_as_bignumber, 'ether'), this.state.myweb3.toWei(stakeholder_dividend, 'ether'))
    
    return firebase
      .database()
      .ref()
      .update(updates)

    

  }

  render() {
    return (
      <tr>
        <td key={this.state.row.address}>{this.state.row.address}</td>
        <td key={this.state.row.city}>{this.state.row.city}</td>
        <td key={this.state.row.state}>{this.state.row.state}</td>
        <td key={this.state.row.zip}>{this.state.row.zip}</td>
        <td key={this.state.row.price}>{this.state.row.price}</td>
        <td>
          <div className="field">
            <div className="control">
              <input
                className="input"
                id={"quote" + this.state.i}
                type="text"
                placeholder="Quote"
                value={this.state.inputValue}
                onChange={evt => this.updateInputValue(evt)}/>
            </div>
          </div>
        </td>
        <td>
          <div className="field">
            <div className="control">
              <button
                className="button is-link"
                id="confirm"
                onClick={() => this.updateHouse(this.state.i, this.state.inputValue)}>
                <span className="icon">
                  <i className="fas fa-paper-plane has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}

export default class Eval extends Component {

  constructor(props) {
    super(props)

    this.state = {
      insurancePlans: [],
      ids: [],
      myweb3: props.myweb3,
      insuranceInstance: props.insuranceInstance,
    }

  }

  componentWillMount() {
    // this.getInsurancePlans()

    let comp = this;
    let housesRef = firebase
      .database()
      .ref('houses/');
    housesRef.on('value', function (snap) {
      let idAcc = []
      snap.forEach(function (item) {
        idAcc.push(item.key)
      })
      comp.setState({
        insurancePlans: snapshotToArray(snap.val()),
        ids: idAcc
      })
    });
  }

  render() {
    console.log(this.props.myweb3)
    console.log(this.props.insuranceInstance)
    return (
      <div>
        <h5 className="title is-5 requester">Homes waiting on quote evaluation</h5>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Price</th>
              <th>Estimated Yearly Quote</th>
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(function (row, i) {
                if (this.state.insurancePlans[i]["quote"].length === 0 || this.state.insurancePlans[i]["quote"].indexOf(":") > 0) {
                  return (<TableRow
                    key={row.address}
                    row={row}
                    i={i}
                    plans={this.state.insurancePlans}
                    ids={this.state.ids}
                    myweb3={this.props.myweb3}
                    insuranceInstance={this.props.insuranceInstance}
                    />)
                }
              }, this)
}
          </tbody>
        </table>
        <h5 className="title is-5 requester">Homes waiting on claim evaluation</h5>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Price</th>
              <th>Amount to be Paid</th>
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody>
          {this
              .state
              .insurancePlans
              .map(row => {
                if (row["status"] === 5) {
                  return <ClaimRow key={row.address} row={row}/>
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }
}