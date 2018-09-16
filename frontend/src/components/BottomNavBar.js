import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddBox from '@material-ui/icons/AddBox';
import Home from '@material-ui/icons/Home';

const styles = theme => ({
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  }
});

class BottomNavBar extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, value } = this.props;
    // const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        className={classes.stickToBottom}
      >
        <BottomNavigationAction icon={<Home/>} component={Link} to='/polls'/>
        <BottomNavigationAction icon={<AddBox/>} component={Link} to='/post'/>
        <BottomNavigationAction icon={<AccountCircle/>} component={Link} to='/profile'/>
      </BottomNavigation>
    );
  }
}
export default withStyles(styles)(BottomNavBar);