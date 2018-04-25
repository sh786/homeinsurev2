import React, {Component} from 'react'
import firebase from 'firebase'

import TableRowWaiting from './RequesterRows/Evaluator'
import TableRowAccepting from './RequesterRows/Acceptance'
import TableRowFunding from './RequesterRows/Funding'
import TableRowActive from './RequesterRows/Active'

const snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { key: e[0] }));

export default class RequesterProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      insurancePlans: []
    }
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <div>
        <h4 className="title is-4 requester">Homes waiting on evaluations</h4>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(row => {
                return <TableRowWaiting key={row.address} row={row}/>
              })}
          </tbody>
        </table>
        <h4 className="title is-4 requester">Homes waiting on acceptance</h4>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Total Value</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(row => {
                return <TableRowAccepting key={row.address} row={row}/>
              })}
          </tbody>
        </table>
        <h4 className="title is-4 requester">Homes waiting on funding</h4>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Total Value</th>
              <th>Price</th>
              <th>Amount Remaining</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(row => {
                return <TableRowFunding key={row.address} row={row}/>
              })}
          </tbody>
        </table>
        <h4 className="title is-4 requester">Active Plans</h4>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Total Value</th>
              <th>Price</th>
              <th>Days Remaining</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(row => {
                return <TableRowActive key={row.address} row={row}/>
              })}
          </tbody>
        </table>
      </div>
    );
  }
}