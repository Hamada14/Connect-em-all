import React, { Component } from 'react';
import './app.css';
import { HashRouter, Route, Redirect } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from './pages/SettingsPage';

import GenericNavigationBar from "./navigation/GenericNavigationBar";
import UserNavigationBar from "./navigation/UserNavigationBar";

import { loadingBlock } from "./Util";

export default class App extends Component {
  state = {
    loggedIn: false,
    email: undefined,
    fullName: undefined,
    loading: false
  };

  constructor(props) {
    super(props);
    
    this.state = {
      loggedIn: undefined,
      email: undefined,
      fullName: undefined,
      loading: true
    };
  
    this.homePage = this.homePage.bind(this);
    this.loginPage = this.loginPage.bind(this);
    this.registerPage = this.registerPage.bind(this);
    this.settingsPage = this.settingsPage.bind(this);
  }
  
  componentDidMount() {
    this.updateLoggedStatus()
  }


  settingsPage() {
    return <SettingsPage />
  }

  updateLoggedStatus() {
    this.setState({ loading: true });
    let loggedIn = false;
    let email = undefined;
    let fullName = undefined;
    fetch('/api/is_logged_in',
      {
        method: 'GET',
        credentials: "same-origin"
      })
      .then(res => res.json())
      .then(result => {
        loggedIn = result.loggedIn;
        if(loggedIn) {
          email = result.email;
          fullName = result.fullName;
        }
        this.setState({ loading: false, loggedIn: loggedIn, email: email, fullName: fullName });
      }).catch(_ => this.setState({ loading: false }));
  }
  
  registerPage() {
    if(this.state.loggedIn) {
      return this.redirectToHome();
    }
    return <RegisterPage />
  }

  homePage() {
    const { loggedIn, _, fullName } = this.state;
    if(!loggedIn) {
      return this.redirectToLogin();
    }
    return (<p>Welcome Home {fullName}!</p>)
  }

  loginPage() {
    const { loggedIn } = this.state;
    if(loggedIn) {
      return this.redirectToHome();
    }
    return <LoginPage loginManager={this} />;
  }

  redirectToHome() {
    return <Redirect to='/' />
  }

  redirectToLogin() {
    return <Redirect to='/login' />;
  }

  render() {
    const loading = this.state.loading;
    let router = (
      <HashRouter>
        <Route exact path="/" component={this.homePage} />
        <Route exact path="/login" component={this.loginPage} />
        <Route exact path="/register" component={this.registerPage} />
        <Route exact path="/settings" component={this.settingsPage} />
      </HashRouter>
    )
    let navigationBar = this.state.loggedIn ? <UserNavigationBar /> : <GenericNavigationBar />;
    if(this.state.loggedIn == undefined) {
      navigationBar = "";
      router = "";
    }
    return (
      <React.Fragment>
        { navigationBar }
        <br />
        {router}
        {loadingBlock(loading)}
      </React.Fragment>
    );
  }
}
