import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import BottomNavBar from "../BottomNavBar";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Leaderboard from "./Leaderboard";
import Paper from "@material-ui/core/Paper/Paper";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ReactGA from "react-ga";

const styles = theme => ({
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  body: {
    backgroundColor: '#068D9D',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5
  },
  tab: {
    width: '50%'
  },
  subHeaders: {
    backgroundColor: '#014262',
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between'
  },
  subHeader: {
    color: '#fff'
  },
  userRank: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    fontSize: '1rem',
    color: '#014262'
  },
  rank: {
    color: '#014262'
  },
  avatar: {
    marginLeft: 5,
    marginRight: 5,
    height: 40,
    width: 40
  },
  rankContainer: {
    margin: 5
  },
  lockedContainer: {
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lockedText: {
    color: '#014262',
    fontSize: '1.2rem'
  }
});

class SocialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      ranking: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      userRankState: false
    }
  }
  componentDidMount() {
    ReactGA.pageview('Leaderboard');
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value, userRankState } = this.state;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.header} variant="display2" noWrap>
              L
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              eaderboard
            </Typography>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>

        <AppBar position="static" elevation={0}>
          <Tabs value={value} onChange={this.handleChange}
                textColor="primary" fullWidth elevation={0}
          >
            <Tab label="Global" className={classes.tab}/>
            <Tab label="Friends" className={classes.tab}/>
          </Tabs>
        </AppBar>
        <div className={classes.body}>
          <Paper elevation={0} className={classes.subHeaders}>
            <Typography variant="subheading" className={classes.subHeader}>
              Rank
            </Typography>
            <Typography variant="subheading" className={classes.subHeader}>
              Name
            </Typography>
            <Typography variant="subheading" className={classes.subHeader}>
              Win Rate
            </Typography>
          </Paper>
        </div>
        {value === 0 && <Leaderboard list={this.state.ranking}/>}
        {value === 1 && <Leaderboard/>}

        {
          userRankState
            ?
              <div className={classes.userRank}>
                <Paper elevation={0} className={classes.rankContainer}>
                  <Typography variant="display2" className={classes.rank}>
                    99
                  </Typography>
                </Paper>
                <Paper elevation={0} className={classes.user}>
                  <Avatar
                  alt="Profile Pic"
                  src="https://via.placeholder.com/128x128"
                  className={classes.avatar}
                  />
                  <Typography variant="title" className={classes.username}>
                  Mad Hatter
                  </Typography>
                  </Paper>
                  <Paper elevation={0}>
                  <Typography variant="subheading" className={classes.rank}>
                  75.0%
                  </Typography>
                </Paper>
              </div>
            :
              <div className={classes.lockedContainer}>
                <Typography variant="title" className={classes.lockedText} align="center">
                  Play at least 10 games to appear on the leaderboard!
                </Typography>
              </div>
        }
        <BottomNavBar value={3}/>
      </div>
    );
  }
}

export default withStyles(styles)(SocialScreen);