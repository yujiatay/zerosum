import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography/Typography";
import ButtonBase from '@material-ui/core/ButtonBase';
import HattleCoin from "../assets/hattlecoin.png";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import AngryHatperor from "../assets/angry-hatperor.png";

import {Query} from "react-apollo";
import gql from "graphql-tag";
import Dialog from "@material-ui/core/Dialog/Dialog";
import CancelButton from "../shared/CancelButton";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import SubmitButton from "../shared/SubmitButton";


const GET_STORE_HATS = gql`
  query GetStoreHats($owned: Boolean!) {
    storeHats(owned: $owned) {
      id
      name
      price
      img
    }
  }
`;


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
  body2: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    overflowY: 'auto',
    height: `calc(100vh - 12.625rem)`, // deduct height of everything else from viewport
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  },
  hat: {
    width: '25vw'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - 12.625rem)`,
  },
  hatperor: {
    width: 250
  },
  dialogText: {
    color: '#068D9D',
  },
});

class ShopList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      dialog: false,
      selectedHat: {}
    }
  }
  handleClose = () => {
    this.setState({
      dialog: false
    })
  };
  handleClick = (hat) => {
    this.setState({
      dialog: true,
      selectedHat: hat
    })
  };

  render() {
    const {classes} = this.props;
    const {selectedHat} = this.state;
    return (
      <Query query={GET_STORE_HATS} variables={{owned: false}} fetchPolicy="cache-and-network" errorPolicy="ignore">
        {({loading, error, data}) => {
          if (loading) return (
            <Paper elevation={0} className={classes.body2}>
              <div className={classes.container}>
                <CircularProgress color="primary"/>
              </div>
            </Paper>
          );
          if (!data) return (
            <Paper elevation={0} className={classes.body2}>
              <div className={classes.container}>
                <img src={AngryHatperor} alt="Hatperor" className={classes.hatperor}/>
                <Typography variant="display1" color="textSecondary">
                  Connection error!
                </Typography>
              </div>
            </Paper>
          );
          const hats = data.storeHats;
          console.log(hats);
          return (
            <Paper elevation={0} className={classes.body}>
              {
                hats.map((hat, index) => (
                  <Paper key={index} className={classes.card}>
                    <ButtonBase className={classes.button} onClick={() => this.handleClick(hat)}>
                      <Paper elevation={0} className={classes.innerCard}>
                        <Typography variant="display1" className={classes.cardTitle}>
                          {hat.name}
                        </Typography>
                        <img alt="Hat" src={hat.img} className={classes.hat}/>
                        <Paper elevation={0} className={classes.moneyInfo}>
                          <img alt="HattleCoin" src={HattleCoin} className={classes.coin}/>
                          <Typography variant="subheading" className={classes.moneyText}>
                            {hat.price}
                          </Typography>
                        </Paper>
                      </Paper>
                    </ButtonBase>
                  </Paper>
                ))
              }
              <Dialog
                open={this.state.dialog}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <CancelButton closeHandler={this.handleClose}/>
                <DialogContent>
                  <Typography variant="title" color="textPrimary" align="center">
                    You're about to buy {selectedHat.name} for {selectedHat.price} HattleCoins.
                  </Typography>
                  <Typography className={classes.dialogText} align="center">
                    HattleCoins are not refundable after submission!
                  </Typography>
                  <SubmitButton submitHandler={() => this.handleSubmit()}/>
                </DialogContent>
              </Dialog>
            </Paper>
          );
        }}
      </Query>

    );
  }
}

export default withStyles(styles)(ShopList);