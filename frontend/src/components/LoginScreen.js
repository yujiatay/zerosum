import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import LoginLogo from './assets/login-logo.png';

const styles = theme => ({
  body: {
    backgroundColor: '#068D9D',
    height: '100vh',
  },
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 3.5rem)`
  },
  logo: {
    width: '100vw',
  }
});

class LoginScreen extends Component {
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
    const { classes } = this.props;
    return (
      <div className = {classes.body}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.header} variant="display2" noWrap>
              L
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              ogin
            </Typography>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          <img alt="Hat" src={LoginLogo} className={classes.logo}/>
          <FacebookLogin
            appId="470572713427485"
            callback={this.fbLoginResponse}
          />
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(LoginScreen); 