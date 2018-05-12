import React, {Component} from 'react'
import firebase from 'firebase'

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
      i: props.i
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


  updateHouse(index, buyAmount) {
    if (buyAmount >= this.state.row.price*0.01){
      var updates = {}
      var id = this.state.ids[index]
      var currRemaining = this.state.insurancePlans[index]["amountRemaining"]
      var amountRemaining = currRemaining - buyAmount

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
        amountRemaining: amountRemaining
      }
      updates['/houses/' + id] = updateData
      this.state.insurancePlans[index] = updateData
      this.state.row = updateData
      this.setState({insurancePlans: this.state.insurancePlans})
      return firebase.database().ref().update(updates)
    }
  }

  render() {
    return (
      <tr>
        <td key={this.state.row.address}>{this.state.row.address}</td>
        <td key={this.state.row.city}>{this.state.row.city}</td>
        <td key={this.state.row.state}>{this.state.row.state}</td>
        <td key={this.state.row.zip}>{this.state.row.zip}</td>
        <td key="quote">{this.state.row.quote}</td>
        <td key="price">{this.state.row.price}</td>
        <td key="remaining">{this.state.row.amountRemaining} ETH</td>
        <td>
          <div className="field">
            <div className="control">
              <input className="input" id={"purchase"} type="text" 
              placeholder={"Min Purchase" + this.state.row.price*0.01} value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
            </div>
          </div>
        </td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-link" id="confirm" onClick={() => this.updateHouse(this.state.i, this.state.inputValue)}>
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
              <th>Risk</th>
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
                  return (<TableRow key={row.address} row={row} i={i} plans={this.state.insurancePlans} ids={this.state.ids}/>)
                }
              }, this)}
          </tbody>
        </table>
      </div>
    );
  }
}