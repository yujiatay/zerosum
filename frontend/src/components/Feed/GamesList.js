import React, { Component } from 'react';
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Dice from '../assets/dice-logo-blue.png';
import Money from '../assets/money-bag.png';

const styles = theme => ({
  body: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    marginBottom: 56,
    height: `calc(100vh - 13.375rem)` // deduct height of everything else from viewport
  },
  card: {
    minWidth: 275,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff'
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
  cardInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0
  },
  cardTitle: {
    color: '#014262'
  },
  button: {
    display: 'block'
  },
  textInfo: {
    marginLeft: 5
  },
  icon: {
    color: '#068D9D'
  },
  dice: {
    height: 16,
    width: 16
  },
  moneybag: {
    height: 24,
    width: 24
  },
  moneyInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 0
  },
  moneyText: {
    lineHeight: 'inherit'
  }
});

class GamesList extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper elevation={0} className={classes.body}>
        {[0, 1, 2, 3, 4].map((game, index) => (
          <Card className={classes.card} key={index}>
            <ButtonBase className={classes.button} component={Link}
                        to={{ pathname: "/game",
                          state: { title: "Democracy vs Communism?",
                            options: ['Forever', '2000', '2010', '2020']}}}>
              <CardContent className={classes.cardContent}>
                <CardContent className={classes.moneyInfo}>
                  <img alt="Pot" src={Money} className={classes.moneybag}/>
                  <Typography variant="subheading" className={classes.moneyText}>
                    99999
                  </Typography>
                </CardContent>
                <Typography className={classes.cardTitle} variant="title" component="h2">
                  Has everything been here forever, or when did it begin to exist?
                </Typography>
              </CardContent>
              <CardContent className={classes.cardContentRow}>
                <CardContent className={classes.cardInfo}>
                  <img alt="Game Mode" src={Dice} className={classes.dice}/>
                  <Typography color="textPrimary" className={classes.textInfo}>
                    Majority
                  </Typography>
                </CardContent>
                <CardContent className={classes.cardInfo}>
                  <FontAwesomeIcon icon="coins" size="1x" className={classes.icon}/>
                  <Typography color="textPrimary" className={classes.textInfo}>
                    Fixed Stakes
                  </Typography>
                </CardContent>
                <CardContent className={classes.cardInfo}>
                  <FontAwesomeIcon icon="hourglass-half" size="1x" className={classes.icon}/>
                  <Typography color="textPrimary" className={classes.textInfo}>
                    23h 39min
                  </Typography>
                </CardContent>
              </CardContent>
            </ButtonBase>
          </Card>
        ))}
      </Paper>
    );
  }
}

export default withStyles(styles)(GamesList);