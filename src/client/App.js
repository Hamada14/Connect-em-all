import React, { Component } from 'react';
import './app.css';
import { HashRouter, Route } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import NewsFeedPage from './pages/NewsFeedPage';
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from './pages/SettingsPage';

import GenericNavigationBar from "./navigation/GenericNavigationBar";

export default class App extends Component {
  state = {};

  settingsPage() {
    return <SettingsPage />
  }

  newsFeedPage() {
    return <NewsFeedPage />
  }

  registerPage() {
    return <RegisterPage />
  }

  homePage() {
    return (<p>Welcome Home!</p>)
  }

  loginPage() {
    return <LoginPage />
  }

  render() {
    const router = (
      <HashRouter>
        <Route exact path="/" component={this.homePage} />
        <Route exact path="/login" component={this.loginPage} />
        <Route exact path="/register" component={this.registerPage} />
        <Route exact path="/news_feed" component={this.newsFeedPage} />
        <Route exact path="/settings" component={this.settingsPage} />
      </HashRouter>
    )
    return (
      <React.Fragment>
        <GenericNavigationBar />
        <br />
        {router}
      </React.Fragment>
    );
  }
}
