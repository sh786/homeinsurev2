import React, {Component} from 'react';

export default class SellInsure extends Component {

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
            <tr>
              <td>123 Main St.</td>
              <td>New York</td>
              <td>NY</td>
              <td>10003</td>
              <td>0.10</td>
              <td>10.3 ETH</td>
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
          </tbody>
        </table>
      </div>
    );
  }
}