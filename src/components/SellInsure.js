import React, {Component} from 'react';
import * as dbFuns from '../dbwrite.js';

const TableRow = ({row}) => (
  <tr>
    <td key={row.address}>{row.address}</td>
    <td key={row.city}>{row.city}</td>
    <td key={row.state}>{row.state}</td>
    <td key={row.zip}>{row.zip}</td>
    <td key={row.risk}>{row.risk}</td>
    <td key={row.amountRemaining}>{row.amountRemaining} ETH</td>
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
);

export default class SellInsure extends Component {
  constructor(props) {
    super(props)

    this.state = {
      insurancePlans: []
    }
  }

  componentWillMount() {
    this.getInsurancePlans()
    dbFuns.getHouseData()
      .then(result => console.log(result))
  }

  getInsurancePlans() {
    // read from db mockdata
    let mockPlans = [
      {
        id: 1,
        address: '123 Main St.',
        city: 'New York',
        state: 'NY',
        zip: '10003',
        risk: 0.20,
        amountRemaining: 10.3
      }, {
        id: 2,
        address: '456 North St.',
        city: 'Ithaca',
        state: 'NY',
        zip: '14850',
        risk: 0.15,
        amountRemaining: 4.2
      }, {
        id: 3,
        address: '789 South St.',
        city: 'Boxford',
        state: 'MA',
        zip: '01921',
        risk: 0.08,
        amountRemaining: 7.2
      }
    ]
    this.setState({insurancePlans: mockPlans})
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
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody>
            {this.state.insurancePlans.map(row => {
              return <TableRow key={row.id} row={row} />
            })}
          </tbody>
        </table>
      </div>
    );
  }
}