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
      insurancePlans: [],
      ids: []
    }
  }

  componentWillMount() {
    //NEED TO PASS DOWN ID OF USER
    let curr_user = "-LBMj8ad2kkpLUZs71re"

    // get homes for each of the four sections
    let comp = this;
    let housesRef = firebase
      .database()
      .ref('houses/');
    housesRef.on('value', function (snap) {
      let idAcc = []
      snap.forEach(function(item) {
        idAcc.push(item.key)
      })
      let temp = snapshotToArray(snap.val())
      let thisUsersHouses = []
      temp.forEach(function(item) {
        if (item["homeowner_id"] == curr_user) {
          thisUsersHouses.push(item)
        }
      })
      comp.setState({insurancePlans: thisUsersHouses, ids: idAcc})
    });
  }

  render() {
    return (
      <div>
        <h4 className="title is-3 requester">Welcome, Requester Name.</h4>
        <h5 className="title is-5 requester">Homes waiting on evaluations</h5>
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
                if (row["status"] == 1) {
                  return <TableRowWaiting key={row.address} row={row}/>
                }
              })}
          </tbody>
        </table>
        <h5 className="title is-5 requester">Homes waiting on acceptance</h5>
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
            {//NEED TO PASS DOWN ID TO COMPONENT
              this
              .state
              .insurancePlans
              .map((row, i) => {
                if (row["status"] == 2) {
                  return <TableRowAccepting key={row.address} row={row} i={i} id={this.state.ids[i]}/>
                }
              })
            }
          </tbody>
        </table>
        <h5 className="title is-5 requester">Homes waiting on funding</h5>
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
                if (row["status"] == 3) {
                  return <TableRowFunding key={row.address} row={row}/>
              }
            })}
          </tbody>
        </table>
        <h5 className="title is-5 requester">Active Plans</h5>
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
              <th>Request Claim</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map(row => {
                if (row["status"] == 4) {
                  return <TableRowActive key={row.address} row={row}/>
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }
}