import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Button from '@material-ui/core/Button';
import AppBar from "@material-ui/core/AppBar/AppBar";
import BottomNavBar from "../BottomNavBar";
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Currency from "../Currency";
import ProgressBar from "./ProgressBar";
import ProfileHats from './ProfileHats';
import ProfileAchievements from "./ProfileAchievements";
import ReactGA from "react-ga";

const styles = theme => ({
  root: {
    height: '100vh',
  },
  body: {
    backgroundColor: theme.palette.background.paper,
  },
  grow: {
    flexGrow: 1,
  },
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  sectionMobile: {
    display: 'flex',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  moneyRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 15
  },
  bigAvatar: {
    width: 120,
    height: 120,
    backgroundColor: 'grey'
  },
  logout: {
    color: '#C1CAD6',
    fontFamily: '"SuperMario256"'
  },
  winrate: {
    fontSize: '1rem'
  },
  tab: {
    width: '50%'
  },
  tabcontainer: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  }
});

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }
  componentDidMount() {
    ReactGA.pageview('Profile');
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  logout = () => {
    localStorage.removeItem("token");
    this.props.history.push("/")
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.header} variant="display2" noWrap>
              P
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              rofile
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionMobile}>
              <Button className={classes.logout} onClick={this.logout}>
                LOGOUT
              </Button>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.body}>
          <div className={classes.moneyRow}>
            <Currency money={100}/>
          </div>
          <div className={classes.row}>
            <Avatar
              alt="Profile Pic"
              src="https://via.placeholder.com/128x128"
              className={classes.bigAvatar}
            />
          </div>
          <Typography variant="headline" align="center">
            MadHatter
          </Typography>
          <Typography className={classes.winrate} variant="title" align="center">
            Win rate: 100%
          </Typography>
          <div className={classes.progressBar}>
            <ProgressBar/>
          </div>

          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}
                  textColor="primary" fullWidth elevation={0}
            >
              <Tab label="Hats" className={classes.tab}/>
              <Tab label="Achievements" className={classes.tab}/>
            </Tabs>
          </AppBar>

        </div>
        {value === 0 && <ProfileHats/>}
        {value === 1 && <ProfileAchievements/>}
        <BottomNavBar value={4}/>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileScreen);