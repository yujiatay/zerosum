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
import BottomNavBar from "../BottomNavBar";
import Button from '@material-ui/core/Button';
import SectionHeader from "./SectionHeader";
import OptionList from "./OptionList";

const styles = theme => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 56,
    marginBottom: 56,

  },
  form: {
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
    marginBottom: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  white: {
    color: '#fff'
  }
});

class CreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      options: [],
      gmode: 'majority',
      vmode: 'nostakes',
      endTime: ''
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeRadio = mode => event => {
    this.setState({ [mode] : event.target.value });
  };

  handleOptions = options => {
    this.setState({
      options: options
    })
  };

  handleEditOption = (option, index) => {
    var options = this.state.options.slice();
    options[index] = option;
    this.setState({
      options: options
    })
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.header} variant="display2" noWrap>
              C
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              reate game
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionMobile}>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.body}>
          <SectionHeader text="Topic"/>
          <form className={classes.form}>
            <TextField
              id="topic"
              placeholder="I want to ask..."
              value={this.state.name}
              onChange={this.handleChange('topic')}
              margin="normal"
              fullWidth
            />
          </form>
          <SectionHeader text="Options"/>
          <OptionList options={this.state.options} addHandler={this.handleOptions} editHandler={this.handleEditOption}/>
          <SectionHeader text="Game Mode"/>
          <FormControl component="fieldset" className={classes.formControl}>
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
          <SectionHeader text="Stakes"/>
          <FormControl component="fieldset" className={classes.formControl}>
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
          <SectionHeader text="Time"/>
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
            <Typography variant="subheading" className={classes.white}>
              Submit
            </Typography>
          </Button>
        </div>

        <BottomNavBar value={2}/>
      </div>
    );
  }
}

export default withStyles(styles)(CreateScreen);