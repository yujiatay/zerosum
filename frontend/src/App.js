import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PollsScreen from "./components/PollsScreen";
import PostScreen from "./components/PostScreen";
import ProfileScreen from "./components/ProfileScreen";
import PollScreen from './components/PollScreen';

const theme = createMuiTheme();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
            <Route path="/polls" component={PollsScreen} />
            <Route path="/post" component={PostScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/poll" component={PollScreen} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
