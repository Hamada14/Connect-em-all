import React from "react";
import { shallow, mount } from 'enzyme';
import { Navbar, Nav } from 'react-bootstrap';

import GenericNavigationBar from "client/navigation/GenericNavigationBar";

const REGISTER_LINK = '#register';
const LOGIN_LINK = '#login';

describe('Generic Navigation bar', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<GenericNavigationBar />);
  });

  it('Contains a single NavBar', () => {
    expect(wrapper.find(Navbar).length).toEqual(1);
  });

  it('Contains two Navs', () => {
    expect(wrapper.find(Nav).length).toEqual(2);
  });

  it('Contains two Nav.Link', () => {
    expect(wrapper.find(Nav.Link).length).toEqual(2)
  });
});


describe('Generic Navigation bar internal Navs', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<GenericNavigationBar />);
  });

  it('Contains a register Nav', () => {
    const registerNav = wrapper.find(Nav.Link).get(0);
    expect(registerNav.props.href).toEqual(REGISTER_LINK);
  })

  it('Contains a login Nav', () => {
    const loginNav = wrapper.find(Nav.Link).get(1);
    expect(loginNav.props.href).toEqual(LOGIN_LINK);
  });
})
