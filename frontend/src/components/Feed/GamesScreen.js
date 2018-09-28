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

const GET_ACTIVE_GAMES = gql`
  query GetActiveGames($filter: String!, $joined: Boolean, $created: Boolean, $limit: Int) {
    activeGames(filter: $filter, joined: $joined, created: $created, limit: $limit) {
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
        result {
          voteCount
          totalValue
          winner
        }
      }
    }
  }
`;

const GET_COMPLETED_GAMES = gql`
  query GetCompletedGames($created: Boolean!) {
    completedGames(created: $created) {
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
        result {
          voteCount
          totalValue
          winner
        }
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
  container: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    marginBottom: 56,
    height: `calc(100vh - 13.375rem)` // deduct height of everything else from viewport
  },
  content: {
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
      sortDialog: false,
      gmode: 'MAJORITY',
      smode: 'FIXED_STAKES',
      searchBarState: false,
      search: '',
      sortState: false
    }
  }

  componentDidMount() {
    ReactGA.pageview('Games Feed');
  };

  handleChange = (event, value) => {
    this.setState({value});
  };
  handleSortOpen = () => {
    this.setState({
      sortDialog: true
    })
  };
  handleSortClose = () => {
    this.setState({
      sortDialog: false
    });
  };
  handleSort = () => {
    this.setState({
      sortState: true,
      sortDialog: false
    })
  };
  applySort = (games) => {
    // Sort by majority/minority
    const gmComparator = (a, b) => {
      let value = 0;
      if (a.gameMode === this.state.gmode && b.gameMode !== this.state.gmode) {
        value = -1;
      } else if (b.gameMode === this.state.gmode && a.gameMode !== this.state.gmode) {
        value = 1;
      }
      return value;
    };
    games.sort(gmComparator);
    // Sort by fixed stakes/no limit
    const smComparator = (a, b) => {
      let value = 0;
      if (a.gameMode === this.state.smode && b.gameMode !== this.state.smode) {
        value = -1;
      } else if (b.gameMode === this.state.smode && a.gameMode !== this.state.smode) {
        value = 1;
      }
      return value;
    };
    games.sort(smComparator);
    return games;
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
  handleSearchOpen = () => {
    this.setState({
      searchBarState: true
    })
  };
  handleSearchClose = () => {
    this.setState({
      searchBarState: false,
      search: ''
    })
  };
  handleSearch = (event) => {
    this.setState({
      search: event.target.value
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
                              onClick={this.handleSearchClose} color="inherit">
                    <FontAwesomeIcon icon="arrow-left" size="sm"/>
                  </IconButton>
                  <Input
                    placeholder="Search"
                    // disableUnderline
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange={this.handleSearch}
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
                    <IconButton aria-haspopup="true" onClick={this.handleSearchOpen} color="inherit">
                      <FontAwesomeIcon icon="search" size="sm"/>
                    </IconButton>
                    <IconButton aria-haspopup="true" onClick={this.handleSortOpen} color="inherit">
                      <FontAwesomeIcon icon="filter" size="sm"/>
                    </IconButton>
                  </div>
                </Fragment>
            }
          </Toolbar>
        </AppBar>
        <Query query={GET_COUNT} fetchPolicy={"network-only"}>
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
            <Tab label="My Games" className={classes.tab}/>
          </Tabs>
        </AppBar>
        {value === 0 &&
        <Query query={GET_ACTIVE_GAMES} variables={{filter: this.state.search, joined: false}} fetchPolicy="network-only">
          {({loading, error, data}) => {
            if (loading) {
              return (
                <Paper elevation={0} className={classes.container}>
                  <div className={classes.content}>
                    <CircularProgress color="primary"/>
                  </div>
                </Paper>
              );
            } else if (error) {
              return (
                <Paper elevation={0} className={classes.container}>
                  <div className={classes.content}>
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
              if (this.state.sortState) {
                games = this.applySort(games);
              }
              return <GamesList games={games}/>
            }
          }}
        </Query>
        }
        {value === 1 &&
        <Query query={GET_ACTIVE_GAMES} variables={{filter: this.state.search, created: true}} fetchPolicy="network-only">
          {({loading: loadingOne, error: errorOne, data: createdActive}) => (
            <Query query={GET_ACTIVE_GAMES} variables={{filter: this.state.search, joined: true, created: false}}
                   fetchPolicy="network-only">
              {({loading: loadingTwo, error: errorTwo, data: joinedActive}) => (
                <Query query={GET_COMPLETED_GAMES} variables={{created: true}} fetchPolicy="network-only">
                  {({loading: loadingThree, error: errorThree, data: createdResolved}) => (
                    <Query query={GET_COMPLETED_GAMES} variables={{created: false}} fetchPolicy="network-only">
                      {({loading: loadingFour, error: errorFour, data: joinedResolved}) => {
                        if (loadingOne || loadingTwo || loadingThree || loadingFour) {
                          // TODO: loading
                          return (
                            <Paper elevation={0} className={classes.container}>
                              <div className={classes.content}>
                                <CircularProgress color="primary"/>
                              </div>
                            </Paper>
                          );
                        } else if (errorOne || errorTwo || errorThree || errorFour) {
                          // TODO: error
                          return (
                            <Paper elevation={0} className={classes.container}>
                              <div className={classes.content}>
                                <img src={AngryHatperor} alt="Hatperor" className={classes.hatperor}/>
                                <Typography variant="display1" color="textSecondary">
                                  Connection error!
                                </Typography>
                              </div>
                            </Paper>
                          );
                        } else {
                          if (createdActive === undefined) createdActive = [];
                          if (joinedActive === undefined) joinedActive = [];
                          if (createdResolved === undefined) createdResolved = [];
                          if (joinedResolved === undefined) joinedResolved = [];
                          let games = createdActive.activeGames.concat(joinedActive.activeGames,
                            createdResolved.completedGames, joinedResolved.completedGames);
                          if (this.state.sortState) {
                            games = this.applySort(games);
                          }
                          return <GamesList games={games}/>
                        }
                      }}
                    </Query>
                  )}
                </Query>
              )}
            </Query>
          )}
        </Query>
        }

        < Dialog
          open={this.state.sortDialog}
          onClose={this.handleSortClose}
          aria-labelledby="form-dialog-title"
        >
          <CancelButton closeHandler={this.handleSortClose}/>
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
            <SubmitButton submitHandler={this.handleSort}/>
          </DialogContent>
        </Dialog>
        <
          BottomNavBar
          value={0}
        />
      </div>
    )
      ;
  }
}

export default withStyles(styles)(GamesScreen);