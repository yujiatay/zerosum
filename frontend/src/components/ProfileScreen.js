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
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    height: '100vh',
  },
  body: {
    backgroundColor: theme.palette.background.paper,
  },
  grow: {
    flexGrow: 1,
  },
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
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
    width: 120,
    height: 120,
    backgroundColor: 'grey'
  },
  logout: {
    color: '#C1CAD6',
    fontFamily: '"SuperMario256"'
  },
  winrate: {
    fontSize: '1rem'
  },
  tab: {
    width: '50%'
  },
  tabcontainer: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  }
});

function TabContainer(props) {
  return (
    <Paper elevation={0} style={{
      backgroundColor: '#068D9D',
      borderRadius: 0,
      overflowY: 'auto',
      marginBottom: 56,
      height: `calc(100vh - 23.375rem)` // deduct height of everything else from viewport
    }}>

      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    </Paper>
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
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.header} variant="display2" noWrap>
              P
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              rofile
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionMobile}>
              <Button className={classes.logout}>
                LOGOUT
              </Button>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.body}>
          <div className={classes.row}>
            <Avatar
              alt="Profile Pic"
              src="https://via.placeholder.com/128x128"
              className={classes.bigAvatar}
            />
          </div>
            <Typography variant="headline" align="center">
              MadHatter
            </Typography>
            <Typography className={classes.winrate} variant="title" align="center">
              Win rate: 100%
            </Typography>
            <Typography variant="title" align="center">
              --- Progress bar ---
            </Typography>

            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}
                    textColor="primary" fullWidth elevation={0}
              >
                <Tab label="Hats" className={classes.tab}/>
                <Tab label="Achievements" className={classes.tab}/>
              </Tabs>
            </AppBar>

        </div>
        {value === 0 && <TabContainer>Item One</TabContainer>}
        {value === 1 && <TabContainer>Item Two</TabContainer>}
        <BottomNavBar value={4}/>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileScreen);