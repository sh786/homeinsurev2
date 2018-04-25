import React, {Component} from 'react'

export default class TableRowAccepting extends Component {

  constructor(props) {
    super(props)

    this.state = {
      row: props.row,
      i: props.i
    }
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
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-link" id="confirm">
                <span className="icon">
                  <i className="fas fa-check has-text-success"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
        <td>
          <div className="field">
            <div className="control">
              <button className="button is-link" id="confirm">
                <span className="icon">
                  <i className="fas fa-times has-text-danger"></i>
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}