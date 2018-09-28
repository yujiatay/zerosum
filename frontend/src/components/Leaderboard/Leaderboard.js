import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography/Typography";
import {withStyles} from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from "@material-ui/core/Avatar/Avatar";
import GoldFeather from '../assets/first-place-feather.png';
import SilverFeather from '../assets/second-place-feather.png';
import BronzeFeather from '../assets/third-place-feather.png';

import {Query} from 'react-apollo';
import gql from "graphql-tag";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import AngryHatperor from "../assets/angry-hatperor.png";


const GET_LEADERBOARD = gql`
  query GetLeaderboard($limit: Int!) {
    leaderboard(limit: $limit) {
      name
      img
      winRate
    }
  }
`;


const styles = theme => ({
  body: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    height: `calc(100vh - 17.4375rem)` // deduct height of everything else from viewport
  },
  card: {
    minWidth: 275,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#fff'
  },
  button: {
    flex: 1,
    display: 'block'
  },
  innerCard: {
    backgroundColor: 'transparent',
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
  userName: {
    fontSize: '1rem'
  },
  gold: {
    color: '#FFD700'
  },
  silver: {
    color: '#C0C0C0'
  },
  bronze: {
    color: '#CD7F32'
  },
  rank: {
    color: '#08ABBE'
  },
  avatar: {
    marginLeft: 5,
    marginRight: 5,
    height: 40,
    width: 40
  },
  rankContainer: {
    display: 'flex',
    margin: 5,
    position: 'relative'
  },
  feather: {
    height: 40,
    width: 40,
    position: 'absolute',
    left: -10,
    top: -5
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 17.4375rem)`
  },
  hatperor: {
    width: 250
  }
});

let parseWinRate = (rawWinRate) => {
  let winRate = rawWinRate * 100.0;
  return winRate.toFixed(1) + "%"
};


class Leaderboard extends Component {
  render() {
    const {classes} = this.props;
    return (
      <Query query={GET_LEADERBOARD} variables={{limit: 10}} fetchPolicy="cache-and-network" errorPolicy="ignore">
        {({loading, error, data}) => {
          if (loading) return (
            <Paper elevation={0} className={classes.body}>
              <div className={classes.container}>
                <CircularProgress color="primary"/>
              </div>
            </Paper>
          );
          if (!data) return (
            <Paper elevation={0} className={classes.body}>
              <div className={classes.container}>
                <img src={AngryHatperor} alt="Hatperor" className={classes.hatperor}/>
                <Typography variant="display1" color="textSecondary">
                  Connection error!
                </Typography>
              </div>
            </Paper>
          );

          const leaders = data.leaderboard;
          return (
            <Paper elevation={0} className={classes.body}>
              {
                leaders &&
                leaders.map((user, index) => (
                  <div key={index}>
                    <Paper elevation={0} className={classes.card}>
                      <ButtonBase className={classes.button}>
                        <div className={classes.innerCard}>
                          <Paper elevation={0} className={classes.rankContainer}>
                            <Typography variant="display2" className={
                              index === 0
                                ? classes.gold
                                : index === 1
                                ? classes.silver
                                : index === 2
                                  ? classes.bronze
                                  : classes.rank}>
                              {index + 1}
                            </Typography>
                            {index === 0 && <img alt="GoldFeather" src={GoldFeather} className={classes.feather}/>}
                            {index === 1 && <img alt="SilverFeather" src={SilverFeather} className={classes.feather}/>}
                            {index === 2 && <img alt="BronzeFeather" src={BronzeFeather} className={classes.feather}/>}
                          </Paper>
                          <Paper elevation={0} className={classes.user}>
                            <Avatar
                              alt="Profile Pic"
                              src={user.img}
                              className={classes.avatar}
                            />
                            <Typography variant="title" className={classes.userName}>
                              {user.name}
                            </Typography>
                          </Paper>
                          <Paper elevation={0}>
                            <Typography variant="subheading">
                              {parseWinRate(user.winRate)}
                            </Typography>
                          </Paper>
                        </div>
                      </ButtonBase>
                    </Paper>
                  </div>
                ))}
            </Paper>
          )
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(Leaderboard);