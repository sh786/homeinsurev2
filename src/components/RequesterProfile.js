import React, {Component} from 'react'
import firebase from 'firebase'

import TableRowWaiting from './RequesterRows/Evaluator'
import TableRowAccepting from './RequesterRows/Acceptance'
import TableRowFunding from './RequesterRows/Funding'
import TableRowActive from './RequesterRows/Active'

const snapshotToArray = snapshot => Object
  .entries(snapshot)
  .map(e => Object.assign(e[1], {key: e[0]}));

export default class RequesterProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      insurancePlans: []
    }
  }

  componentWillMount() {
    // get homes for each of the four sections
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
              <th>Accept</th>
              <th>Decline</th>
            </tr>
          </thead>
          <tbody>
            {/* mock */}
            <tr>
              <td key="{this.state.row.address}">address</td>
              <td key="{this.state.row.city}">city</td>
              <td key="{this.state.row.state}">state</td>
              <td key="{this.state.row.zip}">zip</td>
              <td key="{this.state.row.price}">price</td>
              <td key="{this.state.row.quote}">quote</td>
              <td>
                <div className="field">
                  <div className="control">
                    <button className="button is-link has-background-success" id="confirm">
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
                    <button className="button is-link has-background-danger" id="decline">
                      <span className="icon">
                        <i className="fas fa-lg fa-times has-text-white"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>

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