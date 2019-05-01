import React from "react";
import { shallow, mount } from 'enzyme';
import { Link, HashRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap';

import FriendsListTab from "client/pages/profile/FriendsListTab";
import Friend from "client/pages/profile/Friend";

const profileId = 5;

const userId1 = 1;
const fullName1 = 'mohamed';
const email1 = 'mado@gmail.com';

const userId2 = 2;
const fullName2 = 'mariam';
const email2 = 'maro@gmail.com';

const friends = [
  { userId: userId1, fullName: fullName1, email: email1 },
  { userId: userId2, fullName: fullName2, email: email2 }
];

describe('Friends List UI Component', () => {
  let wrapper;
  let callParams;

  beforeEach(async () => {
    const mockSuccessResponse = {friends: friends};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); //

    wrapper = mount(
      <HashRouter>
        <FriendsListTab profileId={profileId}/>
      </HashRouter>
    );

    await flushPromises();
    wrapper.update();

    callParams = global.fetch.mock.calls[0];
  });

  it('Calls fetch once to contact the API', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('Sends a request to /api/get_friends', () => {
    expect(callParams[0]).toEqual('/api/get_friends');
  });

  it('sends a post request', () => {
    expect(callParams[1].method).toEqual('POST');
  });

  it('sends the submitted parameters', () => {
    expect(callParams[1].body).toEqual(JSON.stringify({ userId: profileId }));
  });

  it('Renders all the received friend', () => {
    expect(wrapper.find(Friend)).toHaveLength(2);
  });

  describe('Single Friend UI component', () => {

    let firstFriend;
    let secondFriend;

    beforeEach(() => {
      firstFriend = wrapper.find(Friend).at(0);
      secondFriend = wrapper.find(Friend).at(1);
    });

    it('Contains the correct userId', () => {
      expect(firstFriend.prop('userId')).toEqual(userId1);
      expect(secondFriend.prop('userId')).toEqual(userId2);
    });

    it('Contains the correct email', () => {
      expect(firstFriend.prop('email')).toEqual(email1);
      expect(secondFriend.prop('email')).toEqual(email2);
    });

    it('Contains the correct name', () => {
      expect(firstFriend.prop('fullName')).toEqual(fullName1);
      expect(secondFriend.prop('fullName')).toEqual(fullName2);
    });
  });
});
