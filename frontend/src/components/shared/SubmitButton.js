import React, { Component } from 'react';
import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase";
import Paper from "@material-ui/core/Paper/Paper";
import {withStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";

const styles = theme => ({
  submit: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2,
    backgroundColor: '#014262'
  },
  buttonBase: {
    flex: 1,
    display: 'block'
  },
  innerSubmit: {
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    padding: 5
  }
});

class SubmitButton extends Component {
  render() {
    const { classes, submitHandler } = this.props;
    return (
      <Paper elevation={1} className={classes.submit}>
        <ButtonBase className={classes.buttonBase} onClick={submitHandler}>
          <Paper elevation={0} className={classes.innerSubmit}>
            <Typography variant="subheading" color="textSecondary">
              Submit
            </Typography>
          </Paper>
        </ButtonBase>
      </Paper>
    );
  }
}

export default withStyles(styles)(SubmitButton);