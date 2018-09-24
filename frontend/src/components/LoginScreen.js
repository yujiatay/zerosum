import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login'
import axios from 'axios'

export default class LoginScreen extends Component {
  fbLoginResponse = res => {
    if (res.userID) {
      axios.post("https://api.zerosum.ml/login/facebook", {
        accessToken: res.accessToken,
        userID: res.userID
      }).then(r => {
        localStorage.setItem("token", r.data);
        this.props.history.push("/")
      }).catch(e => {
        console.log(e);
        // Display login failed
      });
    }
  };

  render() {
    return (
      <FacebookLogin
        appId="470572713427485"
        callback={this.fbLoginResponse}
      />
    )
  }
}
