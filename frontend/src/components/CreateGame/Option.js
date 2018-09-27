import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Input from '@material-ui/core/Input';

const styles = theme => ({
  option: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    padding: 5
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5
  },
  buttonBase: {
    flex: 1,
    display: 'block'
  },
  innerButton: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  inputCenter: {
    textAlign: 'center',
    color: '#fff'
  }
});

class Option extends Component {
  handleInput = event => {
    this.props.editHandler(event.target.value, this.props.index);
  };

  render() {
    const {classes, left, center, right, color, bgColor, button, clickHandler} = this.props;
    return (
      button
        ? <Paper elevation={0} className={classes.button} style={{backgroundColor: bgColor}}>
          <ButtonBase className={classes.buttonBase} onClick={clickHandler}>
            <Paper elevation={0} className={classes.innerButton}>
              <Typography style={{color: color}}>
                {left}
              </Typography>
              <Typography style={{color: color}}>
                {center}
              </Typography>
              <Typography style={{color: color}}>
                {right}
              </Typography>
            </Paper>
          </ButtonBase>
        </Paper>
        :
        <Paper elevation={0} className={classes.option} style={{backgroundColor: bgColor}}>
          <Input placeholder="Type here" disableUnderline autoFocus={false}
                 classes={{input: classes.inputCenter}} fullWidth
                 onChange={this.handleInput}
          />
        </Paper>
    );
  }
}

export default withStyles(styles)(Option);