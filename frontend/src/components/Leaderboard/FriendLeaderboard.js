import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  body: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    height: `calc(100vh - 17.4375rem)` // deduct height of everything else from viewport
  }
});

class FriendLeaderboard extends Component {
  render() {
    const {classes} = this.props;
    return (
      <Paper elevation={0} className={classes.body}>
        {/*Show Facebook Friends (Awaiting app review)*/}
      </Paper>
    );
  }
}

export default withStyles(styles)(FriendLeaderboard);