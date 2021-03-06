import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Button from '@material-ui/core/Button';
import AppBar from "@material-ui/core/AppBar/AppBar";
import BottomNavBar from "../shared/BottomNavBar";
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Currency from "../shared/Currency";
import ProgressBar from "./ProgressBar";
import ProfileHats from './ProfileHats';
import ProfileAchievements from "./ProfileAchievements";
import ReactGA from "react-ga";
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {logout} from "../../utils/auth";

const styles = theme => ({
  root: {
    height: '100vh',
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
  logOut: {
    color: '#C1CAD6',
    fontFamily: '"SuperMario256"'
  },
  winRate: {
    fontSize: '1rem'
  },
  tab: {
    width: '50%'
  }
});

const GET_PROFILE = gql`
  {
    user {
      name
      img
      winRate
      money
      level
      expProgress
    }
  }
`;

let parseWinRate = (rawWinRate) => {
  let winRate = rawWinRate * 100.0;
  return winRate.toFixed(1)
};


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
    this.setState({value});
  };

  render() {
    const {value} = this.state;
    const {classes} = this.props;
    const topBar = (
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.header} variant="display2" noWrap>
            P
          </Typography>
          <Typography className={classes.header} variant="display1" noWrap>
            rofile
          </Typography>
          <div className={classes.grow}/>
          <div className={classes.sectionMobile}>
            <Button className={classes.logOut} onClick={() => {
              logout(() => this.props.authStateHandler(false))
            }}>
              LOGOUT
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    );
    const hatAndAchievementsTabBar = (
      <AppBar position="static">
        <Tabs value={value} onChange={this.handleChange}
              textColor="primary" fullWidth elevation={0}
        >
          <Tab label="Hats" className={classes.tab}/>
          <Tab label="Achievements" className={classes.tab}/>
        </Tabs>
      </AppBar>
    );
    return (
      <Query query={GET_PROFILE} fetchPolicy="cache-and-network" errorPolicy="ignore">
        {({loading, error, data}) => {
          let profile = data ? data.user : null;
          return (
            <div className={classes.root}>
              {topBar}
              <div>
                <div className={classes.moneyRow}>
                  <Currency money={profile ? profile.money : "???"}/>
                </div>
                <div className={classes.row}>
                  <Avatar
                    alt="Profile Pic"
                    src={profile ? profile.img : "https://via.placeholder.com/128x128"}
                    className={classes.bigAvatar}
                  />
                </div>
                <Typography variant="headline" align="center">
                  {profile ? profile.name : "???"}
                </Typography>
                <Typography className={classes.winRate} variant="title" align="center">
                  Win rate: {profile ? parseWinRate(profile.winRate) : 0}%
                </Typography>
                <div className={classes.progressBar}>
                  <ProgressBar level={profile ? profile.level : "?"} expProgress={profile ? profile.expProgress : 0.8}/>
                </div>
                {hatAndAchievementsTabBar}
              </div>
              {value === 0 && <ProfileHats/>}
              {value === 1 && <ProfileAchievements/>}
              <BottomNavBar value={4}/>
            </div>
          )
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(ProfileScreen);