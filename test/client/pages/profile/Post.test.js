import React from "react";
import { shallow, mount } from 'enzyme';
import { Link, HashRouter } from 'react-router-dom'

import Post from "client/pages/profile/Post";

const writer = 'name';
const email = 'email@gmail.com';
const content = 'post content is here';
const date = '2019-04-28 16:48:17'

describe('Post UI Component', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(
      <HashRouter>
        <Post writer={writer} email={email} content={content} date={date}/>
      </HashRouter>
    );
  });

  it('Contains the name of the writer', () => {
    expect(wrapper.find(".tweetEntry-fullname").text()).toEqual(writer);

  });

  it('Contains the email of the writer', () => {
    expect(wrapper.find(".tweetEntry-username").text().substr(8)).toEqual('email@gmail.com');
  });

  it('Contains the date of the post', () => {
    expect(wrapper.find("span.tweetEntry-timestamp").text().substr(3, 24)).toEqual('2019 Apr 28th - 16:48:17')
  });
});
