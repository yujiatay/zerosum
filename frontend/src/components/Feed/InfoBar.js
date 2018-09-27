import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Currency from "../shared/Currency";

import {Query} from 'react-apollo'
import gql from 'graphql-tag'

const GET_PROFILE = gql`
  {
    user {
      money

    }
  }
`;

const styles = theme => ({
  subheader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  }
});

class InfoBar extends Component {
  render() {
    const {classes, left} = this.props;

    return (
      <Paper elevation={0} className={classes.subheader}>
        <Typography variant="title" align="left">
          {left}
        </Typography>
        <Query query={GET_PROFILE} fetchPolicy="cache-and-network" errorPolicy="ignore">
        {({loading, error, data}) => {
          let userMoney = (data && data.user) ? data.user.money : "???";
          return (
            <Currency money={userMoney}/>
          )
        }}
        </Query>
      </Paper>
    );
  }
}

export default withStyles(styles)(InfoBar);