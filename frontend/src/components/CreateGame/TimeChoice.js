import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

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
    justifyContent: 'center',
    margin: 5,
    width: '4rem'
  },
  selectedButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: '#08ABBE',
    width: '4rem'
  },
  buttonBase: {
    flex: 1,
    display: 'block'
  },
  innerButton: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  selectedText: {
    color: '#fff'
  }
});

/**
 * Returns time in minutes. (Temporarily hardcoded)
 */
const calcTime = (index, row) => {
  if (row === 0) {
    return index === 0
      ? 5
      : index === 1
        ? 30
        : index === 2
          ? 60
          : 180
  } else if (row === 1) {
    return index === 0
      ? 360
      : index === 1
        ? 720
        : index === 2
          ? 1080
          : 1440
  } else {
    return 0;
  }
};

class TimeChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstRow: ['5m', '30m', '1h', '3h'],
      secondRow: ['6h', '12h', '18h', '24h'],
      selected: 0
    }
  }

  handleClick = (index, row) => {
    this.setState(prevState => ({
      selected: index + row * 4
    }), () => {
      // console.log(calcTime(index, row));
      this.props.choiceHandler(calcTime(index, row));
    })
  };

  render() {
    const {classes} = this.props;
    const {selected, firstRow, secondRow} = this.state;
    return (
      <div className={classes.container}>
        <div className={classes.row}>
          {
            firstRow.map((choice, index) => (
              <Paper key={index} elevation={0} className={selected === index ? classes.selectedButton : classes.button}>
                <ButtonBase className={classes.buttonBase} onClick={() => this.handleClick(index, 0)}>
                  <Paper elevation={0} className={classes.innerButton}>
                    <Typography className={selected === index ? classes.selectedText : 'none'}>
                      {choice}
                    </Typography>
                  </Paper>
                </ButtonBase>
              </Paper>
            ))
          }
        </div>
        <div className={classes.row}>
          {
            secondRow.map((choice, index) => (
              <Paper key={index} elevation={0}
                     className={selected === (index + 4) ? classes.selectedButton : classes.button}>
                <ButtonBase className={classes.buttonBase} onClick={() => this.handleClick(index, 1)}>
                  <Paper elevation={0} className={classes.innerButton}>
                    <Typography className={selected === (index + 4) ? classes.selectedText : 'none'}>
                      {choice}
                    </Typography>
                  </Paper>
                </ButtonBase>
              </Paper>
            ))
          }
        </div>

        {/*<Paper elevation={0} className={selected ? classes.selectedButton : classes.button}>*/}
        {/*<ButtonBase className={classes.buttonBase} onClick={this.handleClick}>*/}
        {/*<Paper elevation={0} className={classes.innerButton}>*/}
        {/*<Typography className={selected ? classes.selectedText : 'none'}>*/}
        {/*5m*/}
        {/*</Typography>*/}
        {/*</Paper>*/}
        {/*</ButtonBase>*/}
        {/*</Paper>*/}
        {/*<Paper elevation={0} className={selected ? classes.button : classes.selectedButton}>*/}
        {/*<ButtonBase className={classes.buttonBase} onClick={this.handleClick}>*/}
        {/*<Paper elevation={0} className={classes.innerButton}>*/}
        {/*<Typography className={selected ? 'none' : classes.selectedText}>*/}
        {/*30m*/}
        {/*</Typography>*/}
        {/*</Paper>*/}
        {/*</ButtonBase>*/}
        {/*</Paper>*/}

      </div>
    );
  }
}

export default withStyles(styles)(TimeChoice);