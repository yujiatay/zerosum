import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Option from "./Option";

const styles = theme => ({
  container: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
});

class OptionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    }
  }

  handleClick = () => {
    this.setState(prevState => ({
      counter: prevState.counter + 1
    }), () => {
      this.handleAddOption();
    })
  };

  handleAddOption = () => {
    this.props.addHandler([...this.props.options, 'nil'])
  };

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.container}>
        {
          this.props.options.map((option, index) => (
            <Option key={index} index={index} color="#fff" bgColor='#08ABBE' editHandler={this.props.editHandler}/>
          ))
        }

        {this.state.counter < 4 &&
        <Option button clickHandler={this.handleClick}
                color='#C1CAD6' center="NEW OPTION" left="+" bgColor='#d7f1f5'/>
        }
      </div>
    );
  }
}

export default withStyles(styles)(OptionList);