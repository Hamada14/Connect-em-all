import React, { Component } from 'react';
import './app.css';
import { HashRouter, Route, Link } from "react-router-dom";

export default class App extends Component {
  state = {};

  settingsPage() {
    return (
      <p>Settings Page</p>
    )
  }

    newsFeedPage() {
    return (
      <p>News feed page</p>
    )
  }

  registerPage() {
    return (
      <p>Register Page</p>
    )
  }

  homePage() {
    return (
      <p>Welcome Home!</p>
    )
  }

  loginPage() {
    return (
      <p>Login page</p>
    )
  }

  aboutPage() {
    return (
      <p>You are in the about</p>
    )
  }


  render() {
    return (
      <React.Fragment>
        <HashRouter>
          <Route exact path="/" component={this.homePage} />
          <Route exact path="/login" component={this.loginPage} />
          <Route exact path="/register" component={this.registerPage} />
          <Route exact path="/news_feed" component={this.newsFeedPage} />
          <Route exact path="/settings" component={this.settingsPage} />
          <Route exact path="/about" component={this.aboutPage} />
        </HashRouter>
      </React.Fragment>
    );
  }
}
