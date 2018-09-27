import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import HattleCoin from "../assets/hattlecoin.png";

const styles = theme => ({
  coin: {
    height: 24,
    width: 24
  },
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
    color: '#fff'
  },
  blueCircle: {
    borderRadius: '50%',
    backgroundColor: '#014262',
    height: 30,
    width: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -15
  },
  blueRect: {
    backgroundColor: '#068D9D',
    padding: 5,
    width: 75,
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

class Currency extends Component {
  render() {
    const {classes, money} = this.props;

    return (
      <Paper elevation={0} className={classes.moneyInfo}>
        <Paper elevation={0} className={classes.blueCircle}>
          <img alt="HattleCoin" src={HattleCoin} className={classes.coin}/>
        </Paper>
        <Paper elevation={0} className={classes.blueRect}>
          <Typography variant="subheading" className={classes.moneyText}>
            {money}
          </Typography>
        </Paper>
      </Paper>
    );
  }
}

export default withStyles(styles)(Currency);