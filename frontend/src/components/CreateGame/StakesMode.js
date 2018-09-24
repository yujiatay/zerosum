import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Input from "@material-ui/core/Input/Input";

const styles = theme => ({
  container: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  },
  title: {
    fontSize: '1rem'
  },
  input: {
    backgroundColor: '#d7f1f5',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  }
});

class StakesMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstRow: ['No Stakes', 'Fixed Stakes'],
      secondRow: ['Limit', 'No Limit'],
      selected: 0,
      input: ''
    }
  }
  handleClick = (index, row) => {
    this.setState(prevState => ({
      selected: index + row * 2
    }), () => {
      if (this.state.selected === 0) {
        this.props.clickHandler('NO_STAKES');
      } else if (this.state.selected === 1) {
        this.props.clickHandler('FIXED_STAKES');
      } else if (this.state.selected === 2) {
        this.props.clickHandler('FIXED_LIMIT');
      } else if (this.state.selected === 3) {
        this.props.clickHandler('NO_LIMIT');
      } else {
        this.props.clickHandler('nil');
      }
    })
  };
  handleInput = event => {
    // TODO: Throw errors when encountering bad inputs
    var input = event.target.value;
    var regex = /^[a-zA-Z]+$/;
    if (!input.match(regex)) {
      var num = parseInt(input, 10);
      if (num > 0 ) {
        this.props.inputHandler(num);
      } else {
        // Negative number
        console.log("improper format inputted")
      }
    } else {
      // NaN
      console.log("NaN inputted")
    }
  };
  render() {
    const { classes } = this.props;
    const { selected, firstRow, secondRow } = this.state;
    return (
      <div className={classes.container}>
        <div className={classes.row}>
          {
            firstRow.map((stake, index) => (
              <Paper key={index} elevation={0} className={selected === index ? classes.selectedButton : classes.button}>
                <ButtonBase className={classes.buttonBase} onClick={() => this.handleClick(index, 0)}>
                  <Paper elevation={0} className={classes.innerButton}>
                    <Typography className={selected === index ? classes.selectedText : 'none'}>
                      {stake}
                    </Typography>
                  </Paper>
                </ButtonBase>
              </Paper>
            ))
          }
        </div>
        <div className={classes.row}>
          {
            secondRow.map((stake, index) => (
              <Paper key={index} elevation={0} className={selected === (index + 2) ? classes.selectedButton : classes.button}>
                <ButtonBase className={classes.buttonBase} onClick={() => this.handleClick(index, 1)}>
                  <Paper elevation={0} className={classes.innerButton}>
                    <Typography className={selected === (index + 2) ? classes.selectedText : 'none'}>
                      {stake}
                    </Typography>
                  </Paper>
                </ButtonBase>
              </Paper>
            ))
          }
        </div>
        {
          (selected === 1 || selected === 2) &&
            <Paper elevation={0}>
              <Typography variant="title" className={classes.title}>
                Please enter the amount of hattlecoins.
              </Typography>
              <Paper elevation={0} className={classes.input}>
                <Input placeholder="0" disableUnderline fullWidth
                       onChange={this.handleInput}
                />
              </Paper>
            </Paper>
        }
      </div>
    );
  }
}

export default withStyles(styles)(StakesMode);