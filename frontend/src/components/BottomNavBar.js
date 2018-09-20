import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const styles = theme => ({
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
  icon: {
    fontSize: '1.5rem'
  }
});

class BottomNavBar extends Component {
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, value } = this.props;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        className={classes.stickToBottom}
        showLabels={false}
      >
        <BottomNavigationAction icon={<FontAwesomeIcon icon="home" size="lg"/>} component={Link} to='/games'/>
        <BottomNavigationAction icon={<FontAwesomeIcon icon="shopping-cart" size="lg"/>} component={Link} to='/shop'/>
        <BottomNavigationAction icon={<FontAwesomeIcon icon="plus-circle" size="lg"/>} component={Link} to='/post'/>
        <BottomNavigationAction icon={<FontAwesomeIcon icon="trophy" size="lg"/>} component={Link} to='/leaderboard'/>
        <BottomNavigationAction icon={<FontAwesomeIcon icon="user-circle" size="lg"/>} component={Link} to='/profile'/>
      </BottomNavigation>
    );
  }
}
export default withStyles(styles)(BottomNavBar);