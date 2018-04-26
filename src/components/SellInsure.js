import React, {Component} from 'react'
import firebase from 'firebase'

const snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }));

/*const TableRow = ({row}) => (
  <tr>
    <td key={row.address}>{row.address}</td>
    <td key={row.city}>{row.city}</td>
    <td key={row.state}>{row.state}</td>
    <td key={row.zip}>{row.zip}</td>
    <td key={row.quote}>{row.quote}</td>
    <td key={row.valBought}>{row.price - row.valBought} ETH</td>
    <td>
      <div className="field">
        <div className="control">
          <input className="input" id="purchase" type="text" placeholder="ETH Purchase"/>
        </div>
      </div>
    </td>
    <td>
      <div className="field">
        <div className="control">
          <button className="button is-link" id="confirm">
            <span className="icon">
              <i className="fas fa-paper-plane has-text-white"></i>
            </span>
          </button>
        </div>
      </div>
    </td>
  </tr>
);*/


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
    console.log(this.state.inputValue)
  }

  getAverage(quotes) {
    var acc = 0
    for (var i = 0; i < quotes.length; i++) {
      acc += Number(quotes[i])
    }
    return toString(acc/quotes.length)
  }

  //ADJUST TO REFLECT BOUGHT INSURANCE
  updateHouse(index, quote) {
    var updates = {}
    var id = this.state.ids[index]
    var currQuote = this.state.insurancePlans[index]["quote"]
    var quotes = currQuote.split(":")
    var newQuote = currQuote + quote + ":"
    if (currQuote.length > 0 && quotes.length === 1) {
      newQuote = currQuote
    }
    //can adjust to maybe exclude outliers or take in more evaluations
    else if (quotes.length > 4){
      quotes.push(quote)
      newQuote = this.getAverage(quotes)
    }

    var address  = this.state.insurancePlans[index]["address"]
    var city = this.state.insurancePlans[index]["city"]
    var price = this.state.insurancePlans[index]["price"]
    var state = this.state.insurancePlans[index]["state"]
    var zip = this.state.insurancePlans[index]["zip"]
    var updateData = {
      address: address,
      city: city,
      price: price,
      quote: newQuote,
      state: state,
      zip: zip
    }
    updates['/houses/' + id] = updateData
    console.log(updates)
    this.state.insurancePlans[index] = updateData
    this.setState({insurancePlans: this.state.insurancePlans})
    return firebase.database().ref().update(updates)
  }

  render() {
    return (
      <tr>
        <td key={this.state.row.address}>{this.state.row.address}</td>
        <td key={this.state.row.city}>{this.state.row.city}</td>
        <td key={this.state.row.state}>{this.state.row.state}</td>
        <td key={this.state.row.zip}>{this.state.row.zip}</td>
        <td key={this.state.row.quote}>{this.state.row.quote}</td>
        <td key={this.state.row.amountRemaining}>{this.state.row.price - this.state.row.amountRemaining} ETH</td>
        <td>
          <div className="field">
            <div className="control">
              <input className="input" id={"purchase"} type="text" 
              placeholder="ETH Purchase" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
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
              <th>Amount Remaining</th>
              <th>Purchase</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(function(row, i) {
                if (this.state.insurancePlans[i]["quote"].length > 0 && this.state.insurancePlans[i]["quote"].indexOf(":") < 0){
                  return (<TableRow key={row.address} row={row} i={i} plans={this.state.insurancePlans} ids={this.state.ids}/>)
                }
              }, this)}
          </tbody>
        </table>
      </div>
    );
  }
}