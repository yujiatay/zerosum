import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import GamesScreen from "./components/Feed/GamesScreen";
import CreateScreen from "./components/CreateGame/CreateScreen";
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import ProfileScreen from "./components/Profile/ProfileScreen";
import GameScreen from './components/Game/GameScreen';
import ShopScreen from "./components/Shop/ShopScreen";
import SocialScreen from "./components/Leaderboard/SocialScreen";
import LoginScreen from './components/LoginScreen';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faHome, faShoppingCart, faPlusCircle,
  faTrophy, faUserCircle, faSearch, faFilter,
  faArrowLeft, faCoins, faHourglassHalf, faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import {getToken} from "./utils/auth";

library.add(faHome, faShoppingCart, faPlusCircle,
  faTrophy, faUserCircle, faSearch, faFilter,
  faArrowLeft, faCoins, faHourglassHalf, faCheckCircle,
  faExclamationCircle);

ReactGA.initialize('UA-125447140-2', {
  debug: true,
  titleCase: false,
  gaOptions: {
    userId: 123
  }
});
ReactGA.pageview('Main');

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
          paddingTop: 16,
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
    },
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: 0
        },
      }
    },
  }
});

class AppRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoading: true
    };
  }

  componentDidMount() {
    // Check if user is already authenticated
    getToken().then((token) => {
      this.setState({
        isLoggedIn: token !== null,
        isLoading: false
      })
    });
  }

  authStateHandler = (isLoggedIn) => {
    this.setState({
      isLoggedIn: isLoggedIn
    });
    this.props.history.push("/")
  };

  loadingStateHandler = (isLoading) => {
    this.setState({
      isLoading: isLoading
    })
  };

  render() {
    const mainApp = (
      <Switch>
        <Route path="/games" component={GamesScreen}/>
        <Route path="/create" component={CreateScreen}/>
        <Route path="/profile" render={(props) => {
          return (
            <ProfileScreen authStateHandler={this.authStateHandler} {...props} />
          )
        }}/>
        <Route path="/game" component={GameScreen}/>
        <Route path="/shop" component={ShopScreen}/>
        <Route path="/leaderboard" component={SocialScreen}/>
        <Redirect to="/games"/>
      </Switch>
    );
    const loginRoute = (
      <Switch>
        <Route path="/" render={(props) => {
          return (
            <LoginScreen isLoading={this.state.isLoading} authStateHandler={this.authStateHandler}
                         loadingStateHandler={this.loadingStateHandler} {...props}/>
          )
        }}/>
        <Redirect to="/"/>
      </Switch>
    );
    return this.state.isLoggedIn ? mainApp : loginRoute
  }
}

class App extends Component {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
            <Switch>
              <Route path="/" exact component={AppRoutes}/>
              <Route path="/:param" component={AppRoutes}/>
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
