import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BottomNavBar from "../BottomNavBar";
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
import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase";
import Paper from "@material-ui/core/Paper/Paper";
import CancelButton from "../CancelButton";
import SubmitButton from "../SubmitButton";

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
    marginBottom: 10,
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
});

class GamesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      filterDialog: false,
      gmode: 'MAJORITY',
      smode: 'FIXED_STAKES'
    }
  }
  componentDidMount() {
    ReactGA.pageview('Games Feed');
  };
  handleChange = (event, value) => {
    this.setState({ value });
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

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.header} variant="display2" noWrap>
              G
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              ames
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleSearch} color="inherit">
                <FontAwesomeIcon icon="search" size="sm"/>
              </IconButton>
              <IconButton aria-haspopup="true" onClick={this.handleFilter} color="inherit">
                <FontAwesomeIcon icon="filter" size="sm"/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <InfoBar left="999 ongoing games!" right="100"/>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}
                textColor="primary" fullWidth elevation={0}
          >
            <Tab label="All Games" className={classes.tab}/>
            <Tab label="Your Games" className={classes.tab}/>
          </Tabs>
        </AppBar>

        {value === 0 && <GamesList/>}
        {value === 1 && <GamesList/>}

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