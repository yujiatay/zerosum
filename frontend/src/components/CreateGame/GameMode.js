import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = theme => ({
  container: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  selectedButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#08ABBE'
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  selectedText: {
    color: '#fff'
  }
});

class GameMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: true
    }
  }
  handleClick = event => {
    this.setState(prevState => ({
      selected: !prevState.selected
    }), () => {
      if (this.state.selected) {
        this.props.modeHandler('majority')
      } else {
        this.props.modeHandler('minority')
      }
    })
  };
  render() {
    const { classes } = this.props;
    const { selected } = this.state;
    return (
      <div className={classes.container}>
        <Paper elevation={0} className={selected ? classes.selectedButton : classes.button}>
          <ButtonBase className={classes.buttonBase} onClick={this.handleClick}>
            <Paper elevation={0} className={classes.innerButton}>
              <Typography className={selected ? classes.selectedText : 'none'}>
                Majority
              </Typography>
            </Paper>
          </ButtonBase>
        </Paper>
        <Paper elevation={0} className={selected ? classes.button : classes.selectedButton}>
          <ButtonBase className={classes.buttonBase} onClick={this.handleClick}>
            <Paper elevation={0} className={classes.innerButton}>
              <Typography className={selected ? 'none' : classes.selectedText}>
                Minority
              </Typography>
            </Paper>
          </ButtonBase>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(GameMode);