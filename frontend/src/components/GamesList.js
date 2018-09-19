import React, { Component } from 'react';
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = theme => ({
  card: {
    minWidth: 275,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#014262'
  },
  cardContent: {
    paddingTop: 10,
    paddingBottom: 0
  },
  cardContentRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardTitle: {
    color: '#BCF4F5'
  },
  button: {
    display: 'block'
  },
  white: {
    color: '#fff'
  }
});

class GamesList extends Component {
  constructor(props) {
    super(props);
  };
  render() {
    const { classes } = this.props;
    return (
      <Paper elevation={0} style={{
        backgroundColor: '#068D9D',
        borderRadius: 0,
        overflowY: 'auto',
        marginBottom: 56,
        height: `calc(100vh - 13.375rem)` // deduct height of everything else from viewport
      }}>
        {[0, 1, 2].map(value => (
          <div>
            <Card className={classes.card}>
              <ButtonBase className={classes.button} component={Link}
                          to={{ pathname: "/game",
                            state: { title: "Democracy vs Communism?",
                              options: ['Forever', '2000', '2010', '2020']}}}>
                <CardContent className={classes.cardContent}>
                  <Typography className={classes.white} variant="subheading" align="right">
                    $99999
                  </Typography>
                  <Typography className={classes.cardTitle} variant="title" component="h2">
                    Has everything been here forever, or when did it begin to exist?
                  </Typography>
                </CardContent>
                <CardContent className={classes.cardContentRow}>
                  <Typography color="textSecondary">
                    Majority
                  </Typography>
                  <Typography color="textSecondary">
                    Fixed Stakes
                  </Typography>
                  <Typography color="textSecondary">
                    23h 39min
                  </Typography>
                </CardContent>
              </ButtonBase>
            </Card>
          </div>
        ))}
        {/*<Typography component="div" style={{ padding: 8 * 3 }}>*/}
        {/*{props.children}*/}
        {/*</Typography>*/}
      </Paper>
    );
  }
}

export default withStyles(styles)(GamesList);