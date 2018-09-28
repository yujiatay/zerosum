import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";
import Paper from '@material-ui/core/Paper';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import AngryHatperor from "../assets/angry-hatperor.png";

import {Query} from "react-apollo";
import gql from "graphql-tag";

const GET_ACHIEVED_HATS = gql`
  {
    achievedHats {
      id
      name
      img
    }
  }
`;

const styles = theme => ({
  bodyWithHats: {
    backgroundColor: '#068D9D',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: theme.spacing.unit,
    borderRadius: 0,
    overflowY: 'auto',
    height: `calc(100vh - 26.703125rem)`, // deduct height of everything else from viewport
  },
  body: {
    backgroundColor: '#068D9D',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 0,
    overflowY: 'auto',
    height: `calc(100vh - 26.703125rem)`, // deduct height of everything else from viewport
  },
  textContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.unit
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 26.703125rem)`,
  },
  hatperor: {
    width: 250
  },
  hat: {
    width: 75,
    height: 75,
    margin: theme.spacing.unit
  }
});

class ProfileAchievements extends Component {
  render() {
    const {classes} = this.props;

    return (
      <Query query={GET_ACHIEVED_HATS} fetchPolicy="cache-and-network" errorPolicy="ignore">
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
          const hats = data.achievedHats;
          console.log(hats);
          if (hats === undefined || hats.length === 0) {
            return (
              <Paper elevation={0} className={classes.body}>
                <div className={classes.textContainer}>
                  <Typography variant="title" color="textPrimary" className={classes.text}>
                    Start playing now to earn achievements!
                  </Typography>
                </div>
              </Paper>
            );
          } else {
            return (
              <Paper elevation={0} className={classes.bodyWithHats}>
                {
                  hats.map((hat, index) => (
                    <img key={index} alt="Hat" src={hat.img} className={classes.hat}/>
                  ))
                }
              </Paper>
            );
          }
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(ProfileAchievements);