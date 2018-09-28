import React, {Component} from 'react';
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import {withStyles} from '@material-ui/core/styles';
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
  buttonBase: {
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
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 13.375rem)`
  },
  hatperor: {
    width: 250
  }
});


let parseGameMode = (gameModeEnum) => {
  if (gameModeEnum === "MAJORITY") {
    return "Majority"
  } else if (gameModeEnum === "MINORITY") {
    return "Minority"
  }
};

let parseStakes = (stakesEnum) => {
  if (stakesEnum === "NO_STAKES") {
    return "No Stakes"
  } else if (stakesEnum === "FIXED_STAKES") {
    return "Fixed Stakes"
  } else if (stakesEnum === "NO_LIMIT") {
    return "No Limit"
  } else if (stakesEnum === "FIXED_LIMIT") {
    return "Limit"
  }
};

let parseTimeLeft = (endTime) => {
  let diff = Date.parse(endTime) - Date.now();
  if (diff < 0) {
    return "Game ended"
  }
  let totalMinutes = Math.floor(diff / 60000);
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  let retString = " " + minutes + " min";
  if (hours != 0) {
    retString = hours + " h " + retString
  }
  return retString
};


class GamesList extends Component {
  render() {
    const {classes, games} = this.props;
    return (
      <Paper elevation={0} className={classes.body}>
        {games.map((game, index) => (
          <Card className={classes.card} key={index}>
            <ButtonBase className={classes.buttonBase} component={Link}
                        to={{
                          pathname: "/game",
                          state: {
                            parsedGame: {
                              id: game.id,
                              topic: game.topic,
                              gameMode: parseGameMode(game.gameMode),
                              stakes: parseStakes(game.stakes),
                              timeLeft: parseTimeLeft(game.endTime),
                              options: game.options,
                              resolved: game.resolved,
                              voted: game.voted,
                              totalMoney: game.totalMoney,
                              owner: game.owner
                            }
                          }
                        }}>
              <CardContent className={classes.cardContent}>
                <CardContent className={classes.moneyInfo}>
                  <img alt="Pot" src={Money} className={classes.moneybag}/>
                  <Typography variant="subheading" className={classes.moneyText}>
                    {game.totalMoney}
                  </Typography>
                </CardContent>
                <Typography className={classes.cardTitle} variant="title" component="h2">
                  {game.topic}
                </Typography>
              </CardContent>
              <CardContent className={classes.cardContentRow}>
                <Paper elevation={0} className={classes.cardInfo}>
                  <img alt="Game Mode" src={Dice} className={classes.dice}/>
                  <Typography color="textPrimary" className={classes.textInfo}>
                    {parseGameMode(game.gameMode)}
                  </Typography>
                </Paper>
                <Paper elevation={0} className={classes.cardInfo}>
                  <FontAwesomeIcon icon="coins" size="1x" className={classes.icon}/>
                  <Typography color="textPrimary" className={classes.textInfo}>
                    {parseStakes(game.stakes)}
                  </Typography>
                </Paper>
                <Paper elevation={0} className={classes.cardInfo}>
                  <FontAwesomeIcon icon="hourglass-half" size="1x" className={classes.icon}/>
                  <Typography color="textPrimary" className={classes.textInfo}>
                    {parseTimeLeft(game.endTime)}
                  </Typography>
                </Paper>
              </CardContent>
            </ButtonBase>
          </Card>
        ))}
      </Paper>
    );
  }
}

export default withStyles(styles)(GamesList);