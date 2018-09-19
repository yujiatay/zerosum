import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import BottomNavBar from "./BottomNavBar";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 60,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'block',
  },
  sectionMobile: {
    display: 'flex',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  button: {
    marginTop: theme.spacing.unit,
  },
});

class PostScreen extends Component {
  state = {
    topic: '',
    gmode: 'majority',
    vmode: 'nostakes',
    endTime: ''
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeRadio = mode => event => {
    this.setState({ [mode] : event.target.value });
  };


  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.title} variant="title" color="inherit" noWrap>
              Post
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionMobile}>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.root}>
          <FormControl components="fieldset" className={classes.formControl}>
            <TextField
              id="topic"
              label="Topic"
              value={this.state.name}
              onChange={this.handleChange('topic')}
              margin="normal"
              fullWidth
            />
          </FormControl>
          Show Options
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Game mode</FormLabel>
            <RadioGroup
              aria-label="Game mode"
              name="gmode"
              className={classes.group}
              value={this.state.gmode}
              onChange={this.handleChangeRadio('gmode')}
            >
              <FormControlLabel value="majority" control={<Radio />} label="Majority" />
              <FormControlLabel value="minority" control={<Radio />} label="Minority" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Voting mode</FormLabel>
            <RadioGroup
              aria-label="Voting mode"
              name="vmode"
              className={classes.group}
              value={this.state.vmode}
              onChange={this.handleChangeRadio('vmode')}
            >
              <FormControlLabel value="nostakes" control={<Radio />} label="No Stakes" />
              <FormControlLabel value="fixedstakes" control={<Radio />} label="Fixed Stakes" />
              <FormControlLabel value="limit" control={<Radio />} label="Limit" />
              <FormControlLabel value="nolimit" control={<Radio />} label="No Limit" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" className={classes.formControl}>
            <TextField
              id="datetime-local"
              label="End time"
              type="datetime-local"
              // defaultValue="2018-09-16T10:30"
              value={this.state.endTime}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Button variant="contained" color="primary" className={classes.button}>
            POST
          </Button>
        </div>

        <BottomNavBar value={2}/>
      </div>
    );
  }
}

export default withStyles(styles)(PostScreen);