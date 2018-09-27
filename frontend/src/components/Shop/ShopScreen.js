import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import BottomNavBar from "../shared/BottomNavBar";
import Paper from "@material-ui/core/Paper/Paper";
import InfoBar from "../Feed/InfoBar";
import ShopList from "./ShopList";
import ReactGA from "react-ga";

const styles = theme => ({
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  category: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#08ABBE',
    borderRadius: 0,
    paddingTop: 5,
    paddingBottom: 5
  },
  white: {
    color: '#fff'
  }
});

class ShopScreen extends Component {
  componentDidMount() {
    ReactGA.pageview('Shop');
  };

  render() {
    const {classes} = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.header} variant="display2" noWrap>
              S
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              hop
            </Typography>
            <div className={classes.grow}/>
          </Toolbar>
        </AppBar>

        <InfoBar left="Welcome to the shop!" right="100"/>
        <Paper elevation={0} className={classes.category}>
          <Typography variant="subheading" className={classes.white}>
            Hats
          </Typography>
        </Paper>

        <ShopList/>

        <BottomNavBar value={1}/>
      </div>
    );
  }
}

export default withStyles(styles)(ShopScreen);