import React, {Component} from 'react'

export default class TableRowWaiting extends Component {

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
        <td key="address">{this.state.row.address}</td>
        <td key="city">{this.state.row.city}</td>
        <td key="state">{this.state.row.state}</td>
        <td key="zip">{this.state.row.zip}</td>
        <td key="price">{this.state.row.price}</td>
      </tr>
    )
  }
}