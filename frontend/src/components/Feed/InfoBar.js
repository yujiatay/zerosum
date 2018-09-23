import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Currency from "../Currency";

const styles = theme => ({
  subheader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  }
});

class InfoBar extends Component {
  render() {
    const { classes, left, right } = this.props;

    return (
      <Paper elevation={0} className={classes.subheader}>
        <Typography variant="title" align="left">
          {left}
        </Typography>
        <Currency money={right}/>
      </Paper>
    );
  }
}

export default withStyles(styles)(InfoBar);