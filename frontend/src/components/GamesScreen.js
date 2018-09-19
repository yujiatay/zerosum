import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BottomNavBar from "./BottomNavBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AppBar from "@material-ui/core/AppBar/AppBar";
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/FilterList';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 60,
    marginBottom: 60
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
});


class GamesScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar position="fixed">
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
                <SearchIcon />
              </IconButton>
              <IconButton aria-haspopup="true" onClick={this.handleFilter} color="inherit">
                <FilterIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          className={classes.root}
        >
          <Typography color="textPrimary" component="p" align="right">
            Money: $100
          </Typography>
          {[0, 1, 2].map(value => (
            <Grid key={value} item>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary" align="right">
                    Pot: $30
                  </Typography>
                  <Typography variant="title" component="h2">
                    Democracy vs Communism?
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    posted by MadHatter
                  </Typography>
                  <Typography component="p">
                    majority | 3h left
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link}
                          to={{ pathname: "/game",
                            state: { title: "Democracy vs Communism?",
                              options: ['Democracy', 'Communism']}}}>
                    See More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <BottomNavBar value={0}/>
      </div>
    );
  }
}

export default withStyles(styles)(GamesScreen);