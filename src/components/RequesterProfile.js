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
      ids: [],
      myweb3: props.myweb3,
      insuranceInstance: props.insuranceInstance,
    }
  }

  componentWillMount() {
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
          thisUsersHouses.push(item)
        
      })
      comp.setState({insurancePlans: thisUsersHouses, ids: idAcc})
    });
  }

  render() {
    return (
      <div>
        <h5 className="title is-5 requester">Homes waiting on evaluations</h5>
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Total Value</th>
              <th>Assigned Evaluator</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map((row, i) => {
                if (row["status"] === 1 && row["homeowner_id"] === this.props.currentUser.username) {
                  return <TableRowWaiting key={i} row={row}/>
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
              <th>Quoted Premium</th>
              <th>Evaluator</th>
              <th>Accept</th>
              <th>Decline</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map((row, i) => {
                if (row["status"] === 2 && row["homeowner_id"] === this.props.currentUser.username) {
                  return <TableRowAccepting key={i} row={row} i={i} id={this.state.ids[i]} 
                      myweb3={this.props.myweb3} insuranceInstance={this.props.insuranceInstance}/>
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
              <th>Quoted Premium</th>
              <th>Amount Remaining</th>
              <th>Accept</th>
              <th>Decline</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map((row, i) => {
                if (row["status"] === 3 && row["homeowner_id"] === this.props.currentUser.username) {
                  return <TableRowFunding key={i} row={row} id={this.state.ids[i]} 
                      myweb3={this.props.myweb3} insuranceInstance={this.props.insuranceInstance}/>
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
              <th>Premium</th>
              <th>Assigned Claim Evaluator</th>
              <th>Request Claim</th>
            </tr>
          </thead>
          <tbody>
            {this
              .state
              .insurancePlans
              .map((row, i) => {
                if (row["status"] === 4 && row["homeowner_id"] === this.props.currentUser.username) {
                  return <TableRowActive key={i} row={row} i={i} id={this.state.ids[i]}
                      myweb3={this.props.myweb3} insuranceInstance={this.props.insuranceInstance}/>
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }
}