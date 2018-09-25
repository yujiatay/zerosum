import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Avatar from '@material-ui/core/Avatar';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Currency from "./Currency";
import Dice from "./assets/dice-logo-blue.png";
import Paper from '@material-ui/core/Paper';
import Money from './assets/money-bag.png';

const styles = theme => ({
  fullHeight: {
    height: '100vh',
    backgroundColor: '#068D9D'
  },
  grow: {
    flexGrow: 1,
  },
  backButton: {
    justifyContent: 'flex-start'
  },
  header: {
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #BCF4F5`,
  },
  questionCard: {
    borderRadius: 0,
  },
  cardTitle: {
    color: '#014262'
  },
  cardContentRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0
  },
  poster: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    alignItems: 'center'
  },
  avatar: {
    margin: 10,
    height: 50,
    width: 50
  },
  optionSection: {
    backgroundColor: '#068D9D',
    borderRadius: 0,

  },
  optionCard: {
    minWidth: 275,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    display: 'block'
  },
  icon: {
    color: '#068D9D'
  },
  dice: {
    height: 16,
    width: 16
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
    marginBottom: 10
  },
  textInfo: {
    marginLeft: 5
  },
  pot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  potText: {
    color: '#068D9D',
    textDecoration: 'underline'
  },
  moneyBag: {
    width: 24,
    height: 24
  }
});

class GameScreen extends Component {
  render() {
    const {classes} = this.props;
    const {parsedGame} = this.props.location.state;
    return (
      <div className={classes.fullHeight}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.backButton} color="inherit" aria-label="Back"
              component={Link} to="/games"
            >
              <FontAwesomeIcon icon="arrow-left" size="sm"/>
            </IconButton>
            <Typography className={classes.header} variant="display2" noWrap>
              G
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              ame
            </Typography>
            <div className={classes.grow}/>
          </Toolbar>
        </AppBar>

        <div>
          <Card className={classes.questionCard} elevation={0}>
            <CardContent className={classes.cardContentRow}>
              <CardContent className={classes.poster}>
                <Avatar
                  alt="Profile Pic"
                  src="https://via.placeholder.com/128x128"
                  className={classes.avatar}
                />
                <Typography variant="title">
                  Poster
                </Typography>
              </CardContent>
              <Currency money="100"/>
            </CardContent>

            <Paper elevation={0} className={classes.pot}>
              <img alt="Pot" src={Money} className={classes.moneyBag}/>
              <Typography className={classes.potText}>
                0 in the pot!
              </Typography>
            </Paper>

            <CardContent>
              <Typography className={classes.cardTitle} variant="title">
                {parsedGame.topic}
              </Typography>
            </CardContent>

            <CardContent className={classes.cardContentRow}>
              <CardContent className={classes.cardInfo}>
                <img alt="Game Mode" src={Dice} className={classes.dice}/>
                <Typography color="textPrimary" className={classes.textInfo}>
                  {parsedGame.gameMode}
                </Typography>
              </CardContent>
              <CardContent className={classes.cardInfo}>
                <FontAwesomeIcon icon="coins" size="1x" className={classes.icon}/>
                <Typography color="textPrimary" className={classes.textInfo}>
                  {parsedGame.stakes}
                </Typography>
              </CardContent>
              <CardContent className={classes.cardInfo}>
                <FontAwesomeIcon icon="hourglass-half" size="1x" className={classes.icon}/>
                <Typography color="textPrimary" className={classes.textInfo}>
                  {parsedGame.timeLeft}
                </Typography>
              </CardContent>
            </CardContent>
          </Card>

          <Card elevation={0} className={classes.optionSection}>
            <CardContent>
              <Typography className={classes.header} variant="display1" noWrap align="center">
                Choose One Option
              </Typography>
              {
                parsedGame.options.map((option, index) =>
                  <Card key={index} className={classes.optionCard}>
                    <ButtonBase className={classes.button} component={Link} to="/games">
                      <CardContent>
                        <Typography variant="body2" align="center">
                          {option.body}
                        </Typography>
                      </CardContent>
                    </ButtonBase>
                  </Card>
                )
              }
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GameScreen);