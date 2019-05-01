import React from "react";
import { shallow, mount } from 'enzyme';
import { Navbar, Nav } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import UserNavigationBar from "client/navigation/UserNavigationBar";

const HOME_LINK = '#';

const expectedFullName = "jane doe"
describe('User Navigation bar', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<UserNavigationBar fullName={expectedFullName}/>);
  });

  it('Contains a single NavBar', () => {
    expect(wrapper.find(Navbar).length).toEqual(1);
  });

  it('Contains two Navs', () => {
    expect(wrapper.find(Nav).length).toEqual(2);
  });

  it('Contains a single Nav.Link', () => {
    expect(wrapper.find(Nav.Link).length).toEqual(1)
  });
});


describe('User Navigation bar internal Navs', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<UserNavigationBar fullName={expectedFullName} />);
  });

  it('Contains a home Nav', () => {
    const registerNav = wrapper.find(Nav.Link).get(0);
    expect(registerNav.props.href).toEqual(HOME_LINK);
  });

  it('Contains the user name', () => {
    const nameContainer = wrapper.find(Navbar.Text).first();
    expect(nameContainer.props()['children'][1]).toEqual(expectedFullName);
  });
});

describe('Sign out functionality', () => {

  let wrapper;
  let calls;

  const updateLoggedStatus = jest.fn(() => {});
  let loginManager = {
    updateLoggedStatus: updateLoggedStatus
  };

  beforeEach(async () => {
    wrapper = mount(<UserNavigationBar fullName={expectedFullName} loginManager={loginManager} />);
    const mockJsonPromise = Promise.resolve({}); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); //

    wrapper.find(Button).at(3).simulate('click');

    await flushPromises();
  });

  it('Sends a request to /api/sign_out', () => {
    const callParams = global.fetch.mock.calls;
    expect(callParams[0][0]).toEqual('/api/sign_out');
  });

  it('Sends a GET request', () => {
    const callParams = global.fetch.mock.calls;
    expect(callParams[0][1]['method']).toEqual('GET');
  });

  it('Sends a single request', async () => {
    await flushPromises();
    const calls = global.fetch.mock.calls;
    expect(calls.length).toEqual(1);
  });

  it('Update UI logged in status', async () => {
    await flushPromises();
    expect(updateLoggedStatus).toHaveBeenCalledTimes(1);
  })
});
