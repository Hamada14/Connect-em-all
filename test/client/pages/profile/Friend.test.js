import React from "react";
import { shallow, mount } from 'enzyme';
import { Link, HashRouter } from 'react-router-dom'

import Friend from "client/pages/profile/Friend";

const userId = 5;
const fullName = 'fullName';
const email = 'email@gmail.com';

describe('Friend UI Component', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(
      <HashRouter>
        <Friend userId={userId} fullName={fullName} email={email}/>
      </HashRouter>
    );
  });

  it('Contains the full name and email', () => {
    expect(wrapper.find(Link).text()).toEqual('fullName    -   email@gmail.com');
  });

  it('Contains a link to the friend profile', () => {
    expect(wrapper.find(Link).prop('to')).toEqual('/profile/5')
  });
});
