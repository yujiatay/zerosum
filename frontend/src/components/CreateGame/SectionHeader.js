import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";

const styles = theme => ({
  container: {
    backgroundColor: '#068D9D',
    borderRadius: 0,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  }
});

class SectionHeader extends Component {
  render() {
    const {classes, text} = this.props;
    return (
      <Paper elevation={0} className={classes.container}>
        <Typography variant="title" color="textSecondary">
          {text}
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(SectionHeader);