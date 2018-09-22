import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BottomNavBar from "../BottomNavBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AppBar from "@material-ui/core/AppBar/AppBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Paper from '@material-ui/core/Paper';
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import GamesList from "./GamesList";
import HattleCoin from "../assets/hattlecoin.png";

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
  subheader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  tab: {
    width: '50%'
  },
  moneybag: {
    height: 24,
    width: 24
  },
  moneyInfo: {
  display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 0,
    position: 'relative'
  },
  moneyText: {
    lineHeight: 'inherit',
    color: '#fff'
  },
  blueCircle: {
    borderRadius: '50%',
    backgroundColor: '#014262',
    height: 30,
    width: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -15
  },
  blueRect: {
    backgroundColor: '#068D9D',
    padding: 5,
    width: 75,
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

class GamesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
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
        <Paper elevation={0} className={classes.subheader}>
          <Typography variant="title" align="left">
            999 ongoing games!
          </Typography>
          <Paper elevation={0} className={classes.moneyInfo}>
            <Paper elevation={0} className={classes.blueCircle}>
              <img src={HattleCoin} className={classes.moneybag}/>
            </Paper>
            <Paper elevation={0} className={classes.blueRect}>
              <Typography variant="subheading"  className={classes.moneyText}>
                100
              </Typography>
            </Paper>
          </Paper>
        </Paper>
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
        <BottomNavBar value={0}/>
      </div>
    );
  }
}

export default withStyles(styles)(GamesScreen);