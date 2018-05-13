import React, {Component} from 'react'
import firebase from 'firebase'
import {writeHouseData, writeClientData, hash} from '../utils/firebase'

const snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }));

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
    this.setState({
      inputValue: evt.target.value
    })
  }

  getAverage(quotes) {
    var acc = 0
    for (var i = 0; i < quotes.length; i++) {
      acc += Number(quotes[i])
    }
    var ret = (acc/quotes.length).toString()
    return ret
  }

  //ADJUST TO REFLECT BOUGHT INSURANCE

  //TODO: Implement updateAmount function to breakup updateHouse/add_stake_for_stakeholder

  addStakeForStakeholder(_stake_token, _house_token , _payment_expected) {

    // Declaring this for later so we can chain functions on SimpleStorage.
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

            console.log('Adding stake')
            return insuranceInstance.add_stake_for_stakeholder(_stake_token,
                _house_token, _payment_expected, {from: accounts[0], value: _payment_expected})
          })
          .then((result) => {
            console.log('transaction completed')
            // Get the value from the contract to prove it worked.
            return insuranceInstance
              .get_stake_amount
              .call(_stake_token)
          })
          //.then(sleep(1000))
          .then((result) => {
            console.log('amount staked')
            console.log(result.toNumber())
            console.log(result)
            this.updateHouse(this.state.i, this.state.inputValue)

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

  updateHouse(index, buyAmount) {
      var updates = {}
      var id = this.state.ids[index]
      var currRemaining = this.state.insurancePlans[index]["amountRemaining"]
      var amountRemaining = currRemaining - buyAmount
      var status = this.state.insurancePlans[index]["status"]
      //may need to update status here
      var newDays = this.state.insurancePlans[index]["daysRemaining"]
      var quote = this.state.insurancePlans[index]["quote"]
      var status = this.state.insurancePlans[index]["status"]
      var address  = this.state.insurancePlans[index]["address"]
      var city = this.state.insurancePlans[index]["city"]
      var price = this.state.insurancePlans[index]["price"]
      var state = this.state.insurancePlans[index]["state"]
      var zip = this.state.insurancePlans[index]["zip"]
      var h_id = this.state.insurancePlans[index]["homeowner_id"]
      var updateData = {
        address: address,
        city: city,
        price: price,
        quote: quote,
        state: state,
        zip: zip,
        homeowner_id: h_id,
        status: status,
        daysRemaining: newDays,
        amountRemaining: amountRemaining,
        status: status
      }
      updates['/houses/' + id] = updateData
      this.state.insurancePlans[index] = updateData
      this.state.row = updateData
      this.setState({insurancePlans: this.state.insurancePlans})
    
      return firebase.database().ref().update(updates)
  }

  buyShares(){
    var buyAmount = this.state.inputValue
    if (buyAmount >= this.state.row.price*0.01){
      var index = this.state.i
      var id = this.state.ids[index]
      var currRemaining = this.state.insurancePlans[index]["amountRemaining"]
      var amountRemaining = currRemaining - buyAmount
      var stake_token_as_string = String(id) + String(amountRemaining)
      var stake_token = hash(stake_token_as_string)

      var house_token = hash(id)
      console.log('house token ' + house_token)
      console.log('stake_token ' + stake_token)

      var payment_expected = parseInt(buyAmount)

      var payment_expected_as_bignumber = this.state.myweb3.toBigNumber(payment_expected)
      this.addStakeForStakeholder(stake_token, house_token, this.state.myweb3.toWei(payment_expected_as_bignumber, 'ether'))
    }
    else {
      console.log("Need to invest at least minimum")
    }
  }

  render() {
    return (
      <tr>
        <td key="address">{this.state.row.address}</td>
        <td key="city">{this.state.row.city}</td>
        <td key="state">{this.state.row.state}</td>
        <td key="zip">{this.state.row.zip}</td>
        <td key="quote">{this.state.row.quote}</td>
        <td key="price">{this.state.row.price}</td>
        <td key="remaining">{this.state.row.amountRemaining} ETH</td>
        <td>
          <div className="field">
            <div className="control">
              <input className="input" id={"purchase"} type="text" 
              placeholder={"Min Purchase " + this.state.row.price*0.01} value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
            </div>
          </div>
        </td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-link" id="confirm" onClick={() => this.buyShares()}>
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



export default class SellInsure extends Component {
  constructor(props) {
    super(props)

    this.state = {
      insurancePlans: [],
      ids: []
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
      snap.forEach(function(item) {
        idAcc.push(item.key)
      })
      comp.setState({insurancePlans: snapshotToArray(snap.val()), ids: idAcc})
    });
  }

  render() {
    return (
      <div>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Premium</th>
              <th>Price of Home</th>
              <th>Amount Remaining</th>
              <th>Purchase</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(function(row, i) {
                if (this.state.insurancePlans[i]["status"] == 3 && this.state.insurancePlans[i]["amountRemaining"] > 0){
                  return (<TableRow key={row.address} row={row} i={i} plans={this.state.insurancePlans} ids={this.state.ids}
                        myweb3={this.props.myweb3} insuranceInstance={this.props.insuranceInstance}/>)
                }
              }, this)}
          </tbody>
        </table>
      </div>
    );
  }
}