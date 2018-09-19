import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  fullHeight: {
    height: '100vh'
  },
  body: {
    height: '100%'
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
    height: '100%'
  },
  optionCard: {
    minWidth: 275,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    display: 'block'
  }
});

class GameScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    const { title, options } = this.props.location.state;
    return (
      <div className={classes.fullHeight}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.backButton} color="inherit" aria-label="Back"
              component={Link} to="/games"
            >
              <BackIcon/>
            </IconButton>
            <Typography className={classes.header} variant="display2" noWrap>
              G
            </Typography>
            <Typography className={classes.header} variant="display1" noWrap>
              ame
            </Typography>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>

        <div className={classes.body}>
          <Card className={classes.questionCard} elevation={0}>
            <CardContent className={classes.cardContentRow}>
              <CardContent className={classes.poster}>
                <Avatar
                  alt="Profile Pic"
                  src="https://via.placeholder.com/128x128"
                  className={classes.avatar}
                />
                <Typography variant="title">
                  MadHatter
                </Typography>
              </CardContent>
              <Typography variant="subheading">
                $99999
              </Typography>
            </CardContent>
            <CardContent className={classes.cardContent}>
              <Typography className={classes.cardTitle} variant="title" component="h2">
                Has everything been here forever, or when did it begin to exist?
              </Typography>
            </CardContent>
            <CardContent className={classes.cardContentRow}>
              <Typography>
                Majority
              </Typography>
              <Typography>
                Fixed Stakes
              </Typography>
              <Typography>
                23h 39min
              </Typography>
            </CardContent>
          </Card>

          <Card className={classes.optionSection}>
            <CardContent>
              <Typography className={classes.header} variant="display1" noWrap align="center">
                Choose One Option
              </Typography>
              {
                options.map(option =>
                  <Card className={classes.optionCard}>
                    <ButtonBase className={classes.button}>
                      <CardContent>
                        <Typography variant="body2" align="right">
                          {option}
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