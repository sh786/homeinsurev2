import React, {Component} from 'react'
import firebase from 'firebase'

const snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }));

const TableRow = ({row, i}) => (
  <tr>
    <td key={row.address}>{row.address}</td>
    <td key={row.city}>{row.city}</td>
    <td key={row.state}>{row.state}</td>
    <td key={row.zip}>{row.zip}</td>
    <td key={row.price}>{row.price}</td>
    <td>
      <div className="field">
        <div className="control">
          <input className="input" id={"quote" + i} type="text" placeholder="Quote"/>
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
);

export default class Eval extends Component {
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
      let acc = []
      snap.forEach(function(item) {
        acc.push(item.key)
      })
      comp.setState({insurancePlans: snapshotToArray(snap.val()), ids: acc})
    });
  }

  updateHouse(index, quote) {
    var updates = {}
    var id = this.ids[index]
    var currQuote = this.state.insurancePlans()[index][quote]
    updates['/houses/' + id] = currQuote + quote
    return firebase.database().ref().update(updates)
  }

  render() {
    return (
      <div>
        <p>Eval Page</p>
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
              .map(function(row, i) {
                console.log(i)
                return (<TableRow key={row.address} row={row} i={i} parent={this} />
              )})
              // .map((row, i) => {
              //   return <TableRow key={row.address} row={row}/>
              // })
            }
          </tbody>
        </table>
      </div>
    );
  }
}