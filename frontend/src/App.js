import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PollsScreen from "./components/GamesScreen";
import PostScreen from "./components/PostScreen";
import ProfileScreen from "./components/ProfileScreen";
import PollScreen from './components/GameScreen';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faShoppingCart, faPlusCircle,
  faTrophy, faUserCircle, faSearch, faFilter,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

library.add(faHome, faShoppingCart, faPlusCircle,
  faTrophy, faUserCircle, faSearch, faFilter,
  faArrowLeft);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#014262'
    },
    secondary: {
      main: '#068D9D',
    },
    text: {
      primary: '#014262',
      secondary: '#C1CAD6'
    }
  },
  typography: {
    fontFamily: [
      '"Open Sans"',
      '"SuperMario256"',
      '"Acme"',
      'sans-serif'
    ].join(','),
    display2: {
      fontFamily: '"SuperMario256"',
      fontSize: '1.7rem',
      color: '#068D9D',
    },
    display1: {
      fontFamily: '"SuperMario256"',
      fontSize: '1.3rem',
      color: '#068D9D',
    },
    subheading: {
      fontFamily: '"SuperMario256"',
      color: '#068D9D'
    },
    headline: {
      fontFamily: '"Acme"',
      color: '#014262'
    },
    title: {
      fontFamily: '"Acme"',
      color: '#068D9D',
    },
  },
  overrides: {
    MuiBottomNavigation: {
      root: {
        backgroundColor: '#014262'
      }
    },
    MuiBottomNavigationAction: {
      root: {
        color: '#fff',
        minWidth: 0,
        '&$selected': {
          color: '#fff',
          paddingTop: 8,
          backgroundColor: '#01283b'
        },
      }
    },
    MuiTabs: {
      indicator: {
        backgroundColor: 'transparent'
      }
    },
    MuiTab: {
      root: {
        backgroundColor: '#C1CAD6',
      },
      selected: {
        backgroundColor: '#068D9D'
      },
      label: {
        color: '#fff',
        fontFamily: '"SuperMario256"',
        fontSize: '1rem'
      }
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
            <Route path="/games" component={PollsScreen} />
            <Route path="/post" component={PostScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/game" component={PollScreen} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
