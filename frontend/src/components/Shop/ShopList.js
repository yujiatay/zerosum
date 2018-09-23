import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography/Typography";
import ButtonBase from '@material-ui/core/ButtonBase';
import HattleCoin from "../assets/hattlecoin.png";

const styles = theme => ({
  body: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    height: `calc(100vh - 12.625rem)`, // deduct height of everything else from viewport
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    width: '45vw',
    height: '45vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '2.5vw',
    marginRight: '2.5vw',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#014262'
  },
  button: {
    flex: 1,
    display: 'block'
  },
  innerCard: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  cardTitle: {
    color: '#08ABBE',
    textShadow: `-1px 0 #BCF4F5, 0 1px  #BCF4F5, 1px 0  #BCF4F5, 0 -1px  #FFF`,
  },
  coin: {
    height: 24,
    width: 24
  },
  moneyInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  moneyText: {
    color: '#fff',
    lineHeight: 'inherit',
    fontSize: '1.1rem'
  }
});

class ShopList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [0,1,2,3,4,5,6,7,8]
    }
  }
  render() {
    const { classes } = this.props;
    const { items } = this.state;
    return (
      <Paper elevation={0} className={classes.body}>
        {
          items.map((item, index) => (
            <Paper key={index} className={classes.card}>
              <ButtonBase className={classes.button}>
                <Paper elevation={0} className={classes.innerCard}>
                  <Typography variant="display1" className={classes.cardTitle}>
                    Mario Cap
                  </Typography>
                </Paper>
                <Paper elevation={0} className={classes.moneyInfo}>
                  <img alt="HattleCoin" src={HattleCoin} className={classes.coin}/>
                  <Typography variant="subheading"  className={classes.moneyText}>
                    1000
                  </Typography>
                </Paper>
              </ButtonBase>
            </Paper>
          ))
        }
      </Paper>
    );
  }
}
export default withStyles(styles)(ShopList);