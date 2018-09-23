import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  moneyInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 0,
    position: 'relative'
  },
  moneyText: {
    lineHeight: 'inherit',
    fontSize: '2rem',
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  blueCircle: {
    borderRadius: '50%',
    backgroundColor: '#014262',
    height: 60,
    width: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -15,
    top: -20
  },
  expBar: {
    backgroundColor: '#014262',
    width: '60vw',
    height: '7vw',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 2
  },
  expProgress: {
    backgroundColor: '#068D9D',
    width: '30vw',
    height: '5vw',
    display: 'flex',
    justifyContent: 'flex-end',
    borderRadius: 2
  },
});

class ProgressBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Paper elevation={0} className={classes.moneyInfo}>
        <Paper elevation={0} className={classes.blueCircle}>
          <Typography variant="subheading"  className={classes.moneyText}>
            10
          </Typography>
        </Paper>
        <Paper elevation={0} className={classes.expBar}>
          <Paper elevation={0} className={classes.expProgress}>

          </Paper>
        </Paper>
      </Paper>
    );
  }
}

export default withStyles(styles)(ProgressBar);