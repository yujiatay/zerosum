import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import BottomNavBar from "./BottomNavBar";

const styles = theme => ({
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
});

class ShopScreen extends Component {
  render() {
    const { classes } = this.props;
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
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>

        <BottomNavBar value={1}/>
      </div>
    );
  }
}

export default withStyles(styles)(ShopScreen);