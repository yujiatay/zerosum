import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 60,
    marginBottom: 60
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'block',
  },
  sectionMobile: {
    display: 'flex',
  },
});

class GameScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    const { title, options } = this.props.location.state;
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              className={classes.backButton} color="inherit" aria-label="Back"
              component={Link} to="/games"
            >
              <BackIcon/>
            </IconButton>
            <Typography className={classes.title} variant="title" color="inherit" noWrap>
              Poll
            </Typography>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>

        <div className={classes.root}>
          <Typography className={classes.title} variant="title" color="inherit" noWrap>
            Q: {title}
          </Typography>
          {
            options.map(option =>
              <Button variant="outlined" color="primary" className={classes.button}>
                {option}
              </Button>
            )
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GameScreen);