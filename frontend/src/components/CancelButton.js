import React, { Component } from 'react';
import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase";
import Paper from "@material-ui/core/Paper/Paper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  cancel: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    display: 'block'
  },
  innerCancel: {
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 5
  },
  icon: {
    color: '#9d0606'
  },
});

class CancelButton extends Component {
  render() {
    const { classes, closeHandler } = this.props;
    return (
      <Paper elevation={0} className={classes.cancel}>
        <ButtonBase className={classes.cancelButton} onClick={closeHandler}>
          <Paper elevation={0} className={classes.innerCancel}>
            <FontAwesomeIcon icon="times-circle" size="2x" className={classes.icon}/>
          </Paper>
        </ButtonBase>
      </Paper>
    );
  }
}

export default withStyles(styles)(CancelButton);