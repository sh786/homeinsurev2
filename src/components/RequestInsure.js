import React, {Component} from 'react';

export default class RequestInsure extends Component {

  render() {
    return (
      <div>
        <div className="container request-form">
          <h1 className="title">Request Insurance</h1>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input className="input" type="text" placeholder="Name" id="name" />
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="email"
                id="email"
                placeholder="Email input"
                value="email@site.com"/>
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <label className="label">Address</label>
          <div className="field is-grouped">
            <div className="control">
              <input className="input" type="text" placeholder="Street Address" id="address"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="City" id="city"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="State Abbr." id="state"/>
            </div>
            <div className="control">
              <input className="input" type="text" placeholder="Zip" id="zip"/>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button className="button is-link" id="submit">Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}