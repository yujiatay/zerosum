import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Button from '@material-ui/core/Button';
import AppBar from "@material-ui/core/AppBar/AppBar";
import BottomNavBar from "./BottomNavBar";
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 60,
    marginBottom: 60,
    backgroundColor: theme.palette.background.paper,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'block'
  },
  sectionMobile: {
    display: 'flex',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  bigAvatar: {
    margin: 10,
    width: 150,
    height: 150,
    backgroundColor: 'grey'
  },
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class ProfileScreen extends Component {
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
    const { value } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.title} variant="title" color="inherit" noWrap>
              Profile
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionMobile}>
              <Button color="default">
                LOGOUT
              </Button>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.root}>
          <div className={classes.row}>
            <Avatar
              alt="Adelle Charles"
              src="/static/images/uxceo-128.jpg"
              className={classes.bigAvatar}
            />
          </div>
          <Typography variant="headline" component="h3">
            Level 999
          </Typography>
          <p>Progress bar</p>

          <AppBar position="static" color="inherit">
            <Tabs value={value} onChange={this.handleChange} indicatorColor="primary"
                  textColor="primary" scrollable scrollButtons="auto" centered fullWidth
            >
              <Tab label="Hats" />
              <Tab label="Achievements" />
              <Tab label="Polls" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer>Item One</TabContainer>}
          {value === 1 && <TabContainer>Item Two</TabContainer>}
          {value === 2 && <TabContainer>Item Three</TabContainer>}
        </div>

        <BottomNavBar value={2}/>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileScreen);