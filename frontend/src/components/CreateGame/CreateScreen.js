import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from '@material-ui/core/TextField';
import BottomNavBar from "../shared/BottomNavBar";
import Button from '@material-ui/core/Button';
import SectionHeader from "./SectionHeader";
import OptionList from "./OptionList";
import GameMode from "./GameMode";
import TimeChoice from "./TimeChoice";
import StakesMode from "./StakesMode";

import {Mutation} from 'react-apollo';
import gql from "graphql-tag";
import ReactGA from "react-ga";
import Dialog from "@material-ui/core/Dialog/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


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
  },
  progress: {
    margin: theme.spacing.unit * 3
  },
  success: {
    color: '#069d54'
  },
  failure: {
    color: '#9d0606'
  },
  submitDialog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dialogTitle: {
    marginTop: 10,
  },
  errorMsg: {
    color: '#9d0606',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  }
});

class CreateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      options: ['nil', 'nil'],
      gmode: 'MAJORITY',
      smode: 'FIXED_STAKES',
      sinput: -1,
      time: 5, // in minutes
      submitDialog: false,
      submitted: false,
      topicError: false,
      optionError: false
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
  handleClose = () => {
    this.setState({
      submitDialog: false,
    }, () => {
      // TODO: Exclude cases when createGame was called but failed to create
      if (this.state.submitted) {
        this.props.history.push('/games')
      }
    });
  };
  handleSubmit = (createGame) => {
    if (this.state.topic === '') {
      this.setState({
        topicError: true
      })
    } else if (this.state.options[0] === 'nil' || this.state.options[1] === 'nil') {
      this.setState({
        optionError: true
      })
    } else {
      createGame();
      this.setState({
        submitDialog: true,
        submitted: true
      })
    }
  };

  render() {
    const {classes} = this.props;
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
            <div className={classes.grow}/>
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
              autoFocus
            />
          </form>
          {
            this.state.topicError &&
            <Typography className={classes.errorMsg}>
              Please provide a valid topic.
            </Typography>
          }
          <SectionHeader text="Options"/>
          <OptionList options={this.state.options} addHandler={this.handleOptions} editHandler={this.handleEditOption}/>
          {
            this.state.optionError &&
            <Typography className={classes.errorMsg}>
              Please provide valid options.
            </Typography>
          }
          <SectionHeader text="Game Mode"/>
          <GameMode modeHandler={this.handleGameMode}/>
          <SectionHeader text="Stakes"/>
          <StakesMode clickHandler={this.handleStakes} inputHandler={this.handleStakesInput}/>
          <SectionHeader text="Time"/>
          <TimeChoice choiceHandler={this.handleTime}/>
          <Mutation mutation={CREATE_GAME} variables={{
            gameInput: {
              topic: this.state.topic,
              duration: this.state.time,
              gameMode: this.state.gmode,
              stakes: this.state.smode,
              options: this.state.options
            }
          }}>
            {(createGame, {loading, error, called}) => (
              <Fragment>
                <Button variant="contained" color="primary" className={classes.button}
                        onClick={() => this.handleSubmit(createGame)}>
                  <Typography variant="subheading" color="textSecondary">
                    Submit
                  </Typography>
                </Button>
                <Dialog
                  open={this.state.submitDialog}
                  onClose={this.handleClose}
                  aria-labelledby="form-dialog-title"
                >
                  {
                    loading
                      ? <CircularProgress className={classes.progress} size={50}/>
                      : error
                      ?
                      <DialogContent className={classes.submitDialog}>
                        <FontAwesomeIcon icon="exclamation-circle" size="5x" className={classes.failure}/>
                        <Typography variant="title" className={classes.dialogTitle} align="center">
                          Connection failed. Please try again!
                        </Typography>
                      </DialogContent>
                      :
                      <DialogContent className={classes.submitDialog}>
                        <FontAwesomeIcon icon="check-circle" size="5x" className={classes.success}/>
                        <Typography variant="title" className={classes.dialogTitle} align="center">
                          Game was successfully created!
                        </Typography>
                      </DialogContent>
                  }
                </Dialog>
              </Fragment>
            )}
          </Mutation>
        </div>

        <BottomNavBar value={2}/>
      </div>
    );
  }
}

export default withStyles(styles)(CreateScreen);