import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Auth } from "aws-amplify";
import { withRouter } from 'react-router-dom';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      currentUser: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    try {
      // db call to users
      await Auth.signIn(this.state.email, this.state.password)
        .then(user => {
          this.setState({ currentUser: user })
        });
      this.props.auth.userHasAuthenticated(true, this.state.currentUser);
      if (this.state.currentUser.username === '8cf69f19-9be1-404e-83d8-ed1f064a035f'){
        this.props.history.push("/eval");
      } else {
        this.props.history.push("/home");
      }
    } catch (e) {
      alert(e.message);
    }
  }

  render() {
    return (
      <div>
        <section className="hero login">
          <div className="hero-body">
            <div className="container has-text-centered">
              <div className="column is-4 is-offset-4">
                <h3 className="title has-text-grey">Login</h3>
                <p className="subtitle has-text-grey">Please login to proceed.</p>
                <div className="box">
                  <form onSubmit={this.handleSubmit}>
                    <div className="field">
                      <div className="control">
                        <input
                          className="input is-large"
                          type="email"
                          placeholder="Your Email"
                          autoFocus=""
                          ref="email"
                          id="email"
                          onChange={this.handleChange} />
                      </div>
                    </div>

                    <div className="field">
                      <div className="control">
                        <input
                          className="input is-large"
                          type="password"
                          placeholder="Your Password"
                          ref="password"
                          id="password" 
                          onChange={this.handleChange} />
                      </div>
                    </div>
                    <button className="button is-block is-info is-large is-fullwidth" type="submit" disabled={!this.validateForm()}>Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(Login);