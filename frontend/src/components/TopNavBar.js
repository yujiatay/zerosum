import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/FilterList';

const styles = theme => ({
  root: {
    width: '100%',
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

class TopNavBar extends React.Component {
  handleSearch = () => {
    console.log("Search");
  };

  handleFilter = () => {
    console.log("Filter");
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.title} variant="title" color="inherit" noWrap>
              Polls
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleSearch} color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton aria-haspopup="true" onClick={this.handleFilter} color="inherit">
                <FilterIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(TopNavBar);