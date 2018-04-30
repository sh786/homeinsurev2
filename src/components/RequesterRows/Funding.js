import React, {Component} from 'react'

export default class TableRowFunding extends Component {

  constructor(props) {
    super(props)

    this.state = {
      row: props.row,
      i: props.i
    }
  }

  //function for when a homeowner accepts the insurance quote. Will use the contract
  acceptQuote(){
    return
  }

  declineQuote() {
    return
  }

  render() {
    return (
      <tr>
        <td key={this.state.row.address}>{this.state.row.address}</td>
        <td key={this.state.row.city}>{this.state.row.city}</td>
        <td key={this.state.row.state}>{this.state.row.state}</td>
        <td key={this.state.row.zip}>{this.state.row.zip}</td>
        <td key={this.state.row.price}>{this.state.row.price}</td>
        <td key={this.state.row.quote}>{this.state.row.quote}</td>
        <td key='remaining'>{this.state.row.amountRemaining}</td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-small has-background-success" id="confirm" disabled={!(this.state.row.amountRemaining == 0)} onClick={() => this.acceptQuote()}>
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
              <button className="button is-small has-background-danger" id="confirm" disabled={!(this.state.row.amountRemaining == 0)} onClick={() => this.declineQuote()}>
                <span className="icon">
                  <i className="fas fa-lg fa-times has-text-white"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}