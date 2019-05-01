import React from "react";
import { shallow, mount } from 'enzyme';
import { Link, HashRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap';

import FriendRequestsTab from "client/pages/profile/FriendRequestsTab";

const profileId = 5;

const userId1 = 1;
const fullName1 = 'mohamed';
const email1 = 'mado@gmail.com';

const userId2 = 2;
const fullName2 = 'mariam';
const email2 = 'maro@gmail.com';

const friendRequests = [
  { userId: userId1, fullName: fullName1, email: email1 },
  { userId: userId2, fullName: fullName2, email: email2 }
];

describe('Friend Requests UI Component', () => {
  let wrapper;
  let callParams;

  beforeEach(async () => {
    const mockSuccessResponse = {friendRequests: friendRequests};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); //

    wrapper = mount(
      <HashRouter>
        <FriendRequestsTab profileId={profileId}/>
      </HashRouter>
    );

    await flushPromises();
    wrapper.update();

    callParams = global.fetch.mock.calls[0];
  });

  it('Calls fetch once to contact the API', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('Sends a request to /api/get_user_friend_requests', () => {
    expect(callParams[0]).toEqual('/api/get_user_friend_requests');
  });

  it('sends a post request', () => {
    expect(callParams[1].method).toEqual('POST');
  });

  it('sends the submitted parameters', () => {
    expect(callParams[1].body).toEqual(JSON.stringify({ userId: profileId }));
  });

  it('Renders all the received friend Requests', () => {
    expect(wrapper.find(".tweetEntry")).toHaveLength(2);
  });

  describe('Single Friend request UI component', () => {

    let firstRequest;
    let secondRequest;

    beforeEach(() => {
      firstRequest = wrapper.find(".tweetEntry").at(0);
      secondRequest = wrapper.find(".tweetEntry").at(1);
    });

    it('Contains the name of the sender', () => {
      expect(firstRequest.text().substr(0, fullName1.length)).toEqual(fullName1);
      expect(secondRequest.text().substr(0, fullName2.length)).toEqual(fullName2);
    });

    it('Contains the email of the sender', () => {
      expect(firstRequest.text().substr(15, email1.length)).toEqual(email1);
      expect(secondRequest.text().substr(14, email2.length)).toEqual(email2);
    });

    describe('Accepting a friend request', () => {

      let fetchCalls;

      beforeEach(async () => {
        wrapper.find(Button).at(0).simulate('click');

        await flushPromises();
        wrapper.update();

        fetchCalls = global.fetch.mock.calls;
      });

      it('Sends three calls to the API', () => {
        expect(fetchCalls).toHaveLength(3);
      });

      it('Sends a request to /api/accept_friend_request', () => {
        expect(fetchCalls[1][0]).toEqual('/api/accept_friend_request');
      });

      it('Sends a POST request to the API for accepting', () => {
        expect(fetchCalls[1][1].method).toEqual('POST');
      });

      it('Sends the profile id and user id to the API as params', () => {
        expect(fetchCalls[1][1].body).toEqual(JSON.stringify({ userId: userId1 , friendId: profileId }));
      });
    });

    describe('Rejecting a friend request', () => {

      let fetchCalls;

      beforeEach(async () => {
        wrapper.find(Button).at(1).simulate('click');

        await flushPromises();
        wrapper.update();

        fetchCalls = global.fetch.mock.calls;
      });

      it('Sends three calls to the API', () => {
        expect(fetchCalls).toHaveLength(3);
      });

      it('Sends a request to /api/reject_friend_request', () => {
        expect(fetchCalls[1][0]).toEqual('/api/reject_friend_request');
      });

      it('Sends a POST request to the API for accepting', () => {
        expect(fetchCalls[1][1].method).toEqual('POST');
      });

      it('Sends the profile id and user id to the API as params', () => {
        expect(fetchCalls[1][1].body).toEqual(JSON.stringify({ userId: userId1 , friendId: profileId }));
      });
    });
  });
});
