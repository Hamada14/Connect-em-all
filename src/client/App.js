import React, { Component } from 'react';
import './app.css';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from './pages/SettingsPage';
import ProfilePage from "./pages/ProfilePage";

import GenericNavigationBar from "./navigation/GenericNavigationBar";
import UserNavigationBar from "./navigation/UserNavigationBar";
import NewsFeedTab from './pages/profile/NewsFeedTab'

import { loadingBlock } from "./Util";

export default class App extends Component {
  state = {
    loggedIn: false,
    userId: undefined,
    email: undefined,
    fullName: undefined,
    birthdate: undefined,
    loading: false
  };

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: undefined,
      userId: undefined,
      email: undefined,
      fullName: undefined,
      birthdate: undefined,
      loading: true
    };

    this.homePage = this.homePage.bind(this);
    this.loginPage = this.loginPage.bind(this);
    this.registerPage = this.registerPage.bind(this);
    this.settingsPage = this.settingsPage.bind(this);
    this.profilePage = this.profilePage.bind(this);
  }

  componentDidMount() {
    this.updateLoggedStatus()
  }

  settingsPage() {
    if(!this.state.loggedIn) {
      return this.redirectToLogin();
    }
    return (
      <SettingsPage
        email={this.state.email}
        fullName={this.state.fullName}
        birthdate={this.state.birthdate}
        loginManager={this}
      />
    )
  }

  updateLoggedStatus() {
    this.setState({ loading: true });
    let loggedIn = false;
    let userId = undefined;
    let email = undefined;
    let fullName = undefined;
    let birthdate = undefined;
    fetch('/api/is_logged_in',
      {
        method: 'GET',
        credentials: "same-origin"
      })
      .then(res => res.json())
      .then(result => {
        loggedIn = result.loggedIn;
        if(loggedIn) {
          userId = result.userId;
          email = result.email;
          fullName = result.fullName;
          birthdate = result.birthdate;
        }
        this.setState({ loading: false, loggedIn: loggedIn, userId: userId, email: email, fullName: fullName, birthdate: birthdate });
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
    return (
      <div className="newsFeed">
        <Card>
          <Card.Body>
            <NewsFeedTab clientId={this.state.userId} fullName={fullName} />
          </Card.Body>
        </Card>
      </div>
    )
  }

  loginPage() {
    if(this.state.loggedIn) {
      return this.redirectToHome();
    }
    return <LoginPage loginManager={this} />;
  }


  profilePage(arg) {
    if(!this.state.loggedIn) {
      return this.redirectToLogin();
    }
    let profileUserId = arg.match.params.userId;
    let clientUserId = this.state.userId;
    return <ProfilePage clientId={clientUserId} profileId={profileUserId} fullName={this.state.fullName}/>;
  }

  redirectToHome() {
    return <Redirect to='/' />
  }

  redirectToLogin() {
    return <Redirect to='/login' />;
  }

  render() {
    const loading = this.state.loading;
    let navigationBar = <GenericNavigationBar />
    if(this.state.loggedIn) {
      navigationBar = (
        <UserNavigationBar
          loginManager={this}
          fullName={this.state.fullName}
          userId={this.state.userId}
        />
      );
    }
    let router = (
      <HashRouter>
        {navigationBar}
        <br />
        <Route exact path="/" component={this.homePage} />
        <Route exact path="/login" component={this.loginPage} />
        <Route exact path="/register" component={this.registerPage} />
        <Route exact path="/settings" component={this.settingsPage} />
        <Route exact path="/profile/:userId" component={this.profilePage} />
      </HashRouter>
    )
    if(this.state.loggedIn == undefined) {
      navigationBar = "";
      router = "";
    }
    return (
      <React.Fragment>
        {router}
        <br />
        {loadingBlock(loading)}
      </React.Fragment>
    );
  }
}
