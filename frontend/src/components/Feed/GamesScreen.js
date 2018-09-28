import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BottomNavBar from "../shared/BottomNavBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AppBar from "@material-ui/core/AppBar/AppBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import GamesList from "./GamesList";
import InfoBar from "./InfoBar";
import ReactGA from 'react-ga';
import Dialog from "@material-ui/core/Dialog/Dialog";
import GameMode from "../CreateGame/GameMode";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import StakesMode from "../CreateGame/StakesMode";
import CancelButton from "../shared/CancelButton";
import SubmitButton from "../shared/SubmitButton";
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';

import {Query} from 'react-apollo';
import gql from "graphql-tag";
import CircularProgress from "@material-ui/core/CircularProgress";
import AngryHatperor from "../assets/angry-hatperor.png";
import Currency from "../shared/Currency";


const GET_ACTIVE_GAMES = gql`
  query GetActiveGames($filter: String!, $joined: Boolean!, $limit: Int, $after: String) {
    activeGames(filter: $filter, joined: $joined, limit: $limit, after: $after) {
      id
      owner {
        name
        img
      }
      topic
      endTime
      totalMoney
      resolved
      voted
      stakes
      gameMode
      options {
        id
        body
      }
    }
  }
`;

const GET_COUNT = gql`
  {
    gameCount
  }
`;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    minWidth: 275,
    margin: 10,
    borderRadius: 10
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  grow: {
    flexGrow: 1,
  },
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  tab: {
    width: '50%'
  },
  dialogTitle: {
    color: '#014262',
    marginTop: 10,
    fontSize: '1.5rem'
  },
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
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  backButton: {
    justifyContent: 'flex-start'
  },
  body: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    marginBottom: 56,
    height: `calc(100vh - 13.375rem)` // deduct height of everything else from viewport
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 13.375rem)`
  },
  hatperor: {
    width: 250
  }
});

class GamesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      filterDialog: false,
      gmode: 'MAJORITY',
      smode: 'FIXED_STAKES',
      searchBarState: false
    }
  }

  componentDidMount() {
    ReactGA.pageview('Games Feed');
  };

  handleChange = (event, value) => {
    this.setState({value});
  };
  handleFilter = () => {
    this.setState({
      filterDialog: true
    })
  };
  handleClose = () => {
    this.setState({
      filterDialog: false
    });
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
  handleSearch = () => {
    this.setState({
      searchBarState: true
    })
  };
  handleBack = () => {
    this.setState({
      searchBarState: false
    })
  };

  render() {
    const {classes} = this.props;
    const {value, searchBarState} = this.state;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            {
              searchBarState
                ?
                <Fragment>
                  <IconButton aria-haspopup="true" className={classes.backButton}
                              onClick={this.handleBack} color="inherit">
                    <FontAwesomeIcon icon="arrow-left" size="sm"/>
                  </IconButton>
                  <Input
                    placeholder="Search"
                    // disableUnderline
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                  />
                </Fragment>
                : <Fragment>
                  <Typography className={classes.header} variant="display2" noWrap>
                    G
                  </Typography>
                  <Typography className={classes.header} variant="display1" noWrap>
                    ames
                  </Typography>
                  <div className={classes.grow}/>
                  <div className={classes.sectionMobile}>
                    <IconButton aria-haspopup="true" onClick={this.handleSearch} color="inherit">
                      <FontAwesomeIcon icon="search" size="sm"/>
                    </IconButton>
                    <IconButton aria-haspopup="true" onClick={this.handleFilter} color="inherit">
                      <FontAwesomeIcon icon="filter" size="sm"/>
                    </IconButton>
                  </div>
                </Fragment>
            }
          </Toolbar>
        </AppBar>
        <Query query={GET_COUNT} fetchPolicy={"no-cache"}>
          {({loading, error, data}) => {
            let gamesCount = loading ? "???"
              : error ? "???"
                : data.gameCount === undefined ? "???"
                : data.gameCount;
            return <InfoBar left={gamesCount + " ongoing games!"}/>
          }}
        </Query>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}
                textColor="primary" fullWidth elevation={0}
          >
            <Tab label="All Games" className={classes.tab}/>
            <Tab label="Your Games" className={classes.tab}/>
          </Tabs>
        </AppBar>
        {value === 0 &&
        <Query query={GET_ACTIVE_GAMES} variables={{filter: "", joined: false}} fetchPolicy="no-cache">
          {({loading, error, data}) => {
            if (loading) {
              return (
                <Paper elevation={0} className={classes.body}>
                  <div className={classes.container}>
                    <CircularProgress color="primary"/>
                  </div>
                </Paper>
              );
            } else if (error) {
              return (
                <Paper elevation={0} className={classes.body}>
                  <div className={classes.container}>
                    <img src={AngryHatperor} alt="Hatperor" className={classes.hatperor}/>
                    <Typography variant="display1" color="textSecondary">
                      Connection error!
                    </Typography>
                  </div>
                </Paper>
              );
            } else {
              let games = data.activeGames;
              if (games === undefined) games = [];
              console.log(games);
              return <GamesList games={games}/>
            }
          }}
        </Query>
        }
        {value === 1 && <GamesList games={[]}/>}

        <Dialog
          open={this.state.filterDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <CancelButton closeHandler={this.handleClose}/>
          <DialogContent>
            <Typography variant="title" className={classes.dialogTitle} align="center">
              Sort by
            </Typography>
            <Typography variant="title" align="left">
              Game Mode
            </Typography>
            <GameMode modeHandler={this.handleGameMode}/>
            <Typography variant="title" align="left">
              Stakes Mode
            </Typography>
            <StakesMode clickHandler={this.handleStakes}/>
            <SubmitButton submitHandler={this.handleSubmit}/>
          </DialogContent>
        </Dialog>
        <BottomNavBar value={0}/>
      </div>
    );
  }
}

export default withStyles(styles)(GamesScreen);