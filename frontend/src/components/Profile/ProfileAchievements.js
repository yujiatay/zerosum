import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  body: {
    backgroundColor: '#068D9D',
    display: 'flex',
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
  }
});

class ProfileAchievements extends Component {
  render() {
    const {classes} = this.props;
    return (
      <Paper elevation={0} className={classes.body}>
        <div className={classes.textContainer}>
          <Typography variant="title" color="textPrimary" className={classes.text}>
            Start playing now to earn achievements!
          </Typography>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(ProfileAchievements);