import React, {Component} from 'react'
import {removeHouse} from '../../utils/firebase'
import firebase from 'firebase'

export default class ClaimRow extends Component {

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

  updateHouse(index, quote) {
    // change status of home to claimed

    // enter in a claim amount
  }

  render() {
    return (
      <tr>
        <td key={this.state.row.address}>{this.state.row.address}</td>
        <td key={this.state.row.city}>{this.state.row.city}</td>
        <td key={this.state.row.state}>{this.state.row.state}</td>
        <td key={this.state.row.zip}>{this.state.row.zip}</td>
        <td key={this.state.row.price}>{this.state.row.price}</td>
        <td>
          <div className="field">
            <div className="control">
              <input className="input" id={"payment" + this.state.i} type="text" 
              placeholder="payment" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
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