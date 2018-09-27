import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from '@material-ui/core/TextField';
import BottomNavBar from "../BottomNavBar";
import Button from '@material-ui/core/Button';
import SectionHeader from "./SectionHeader";
import OptionList from "./OptionList";
import GameMode from "./GameMode";
import TimeChoice from "./TimeChoice";
import StakesMode from "./StakesMode";

import { Mutation } from 'react-apollo';
import gql from "graphql-tag";
import ReactGA from "react-ga";


const CREATE_GAME = gql`
  mutation CreateGame($gameInput: GameInput!) {
    addGame(game: $gameInput) {
      id
      endTime
    }
  }
`;

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
      gmode: 'MAJORITY',
      smode: 'FIXED_STAKES',
      sinput: -1,
      time: 5 // in minutes
    };
  }
  componentDidMount() {
    ReactGA.pageview('Create Game');
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
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
  handleGameMode = mode => {
    this.setState({
      gmode: mode
    })
  };
  handleStakes = stake => {
    this.setState({
      smode: stake
    })
  };
  handleStakesInput = input => {
    this.setState({
      sinput: input
    })
  };
  handleTime = time => {
    this.setState({
      time: time
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
          <GameMode modeHandler={this.handleGameMode}/>
          <SectionHeader text="Stakes"/>
          <StakesMode clickHandler={this.handleStakes} inputHandler={this.handleStakesInput}/>
          <SectionHeader text="Time"/>
          <TimeChoice choiceHandler={this.handleTime}/>
          <Mutation mutation={CREATE_GAME} variables={{ gameInput: {
            topic: this.state.topic,
            duration: this.state.time,
            gameMode: this.state.gmode,
            stakes: this.state.smode,
            options: this.state.options
          }}}>
            {createGame => (
            <Button variant="contained" color="primary" className={classes.button} onClick={createGame}>
              <Typography variant="subheading" className={classes.white}>
                Submit
              </Typography>
            </Button>
            )}
          </Mutation>
        </div>

        <BottomNavBar value={2}/>
      </div>
    );
  }
}

export default withStyles(styles)(CreateScreen);