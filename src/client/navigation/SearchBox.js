import React, { Component } from "react";
import { Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'

export default class SearchBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchEmail: '',
      userId: undefined
    }
    this.handleSearchEmailChange = this.handleSearchEmailChange.bind(this)
  }

  async handleSearchEmailChange() {
    await this.setState({ searchEmail: event.target.value })
    fetch('/api/search_user_by_email',
      {
        method: 'POST',
        credentials: "same-origin",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.searchEmail })
      })
      .then(response => response.json())
      .then(response => {
        if(response.errors.length == 0) {
          this.setState( {userId: response.userId} )
        } else {
          this.setState( {userId: undefined} )
        }
      })
  }

  render() {
    let searchButton = '';
    if(this.state.userId) {
      let path = "/profile/" + this.state.userId;
      searchButton = <Link to={path}> <Button variant="outline-success">Search</Button> </Link>;
    } else {
      searchButton = <Button variant="outline-danger" disabled>Search</Button>
    }
    return (
      <React.Fragment>
        <Form inline>
          <FormControl value={this.state.searchEmail}
                      type="text"
                      placeholder="Search"
                      className="mr-sm-2"
                      onChange={this.handleSearchEmailChange} />
          {searchButton}
        </Form>
      </React.Fragment>
    )
  }
}
