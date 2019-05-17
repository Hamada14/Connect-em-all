import React from "react";
import { shallow, mount } from 'enzyme';
import { Link, HashRouter } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap';

import TimelineTab from "client/pages/profile/TimelineTab";
import Post from "client/pages/profile/Post";

const profileId = 5;
const clientId = 5;

const name1 = 'name1';
const content1 = 'content1'
const email1 = 'email1';
const date1 = '2019-04-28 16:48:17';

const name2 = 'name2';
const content2 = 'content2';
const email2 = 'email2';
const date2 = '2019-04-22 16:48:17'

const posts = [
  {POST_ID: 1, FULL_NAME:name1, CONTENT:content1, EMAIL:email1, CREATED_AT:date1},
  {POST_ID: 2, FULL_NAME:name2, CONTENT:content2, EMAIL:email2, CREATED_AT:date2}
];

describe('Timeline UI Component', () => {
  let wrapper;
  let callParams;

  beforeEach(async () => {
    const mockSuccessResponse = {posts: posts};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); //

    wrapper = mount(
      <HashRouter>
        <TimelineTab clientId={clientId} profileId={profileId}/>
      </HashRouter>
    );

    await flushPromises();
    wrapper.update();

    callParams = global.fetch.mock.calls[0];
  });

  it('Calls fetch once to contact the API', () => {
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('Sends a request to /api/get_posts_by_user?userId=' + profileId, () => {
    expect(callParams[0]).toEqual('/api/get_posts_by_user?userId=' + profileId);
  });

  it('sends a post request', () => {
    expect(callParams[1].method).toEqual('GET');
  });

  it('Renders all the received posts', () => {
    expect(wrapper.find(Post)).toHaveLength(2);
  });

  describe('Single Post UI component', () => {

    let firstPost;
    let secondPost;

    beforeEach(() => {
      firstPost = wrapper.find(Post).at(0);
      secondPost = wrapper.find(Post).at(1);
    });

    it('Contains the correct writer', () => {
      expect(firstPost.prop('writer')).toEqual(name1);
      expect(secondPost.prop('writer')).toEqual(name2);
    });

    it('Contains the correct content', () => {
      expect(firstPost.prop('content')).toEqual(content1);
      expect(secondPost.prop('content')).toEqual(content2);
    });

    it('Contains the correct email', () => {
      expect(firstPost.prop('email')).toEqual(email1);
      expect(secondPost.prop('email')).toEqual(email2);
    });

    it('Contains the correct date', () => {
      expect(firstPost.prop('date')).toEqual(date1);
      expect(secondPost.prop('date')).toEqual(date2);
    });
  });

  describe('Writing a post', () => {
    const postContent = 'this is a post';
    let fetchCalls;

    beforeEach(async () => {
      wrapper.find(Form.Control).at(0).simulate('change', {
        target: { value: postContent }
      });
      wrapper.find(Button).at(0).simulate('click');

      await flushPromises();
      wrapper.update();

      fetchCalls = global.fetch.mock.calls;
    });

    it('Sends five calls to the API', () => {
      expect(fetchCalls).toHaveLength(5);
    });

    it('Sends a request to /api/create_post', () => {
      expect(fetchCalls[3][0]).toEqual('/api/create_post');
    });

    it('Sends a POST request to the API for creating the post', () => {
      expect(fetchCalls[3][1].method).toEqual('POST');
    });

    it('Sends the profile id and content to the API as params', () => {
      expect(fetchCalls[3][1].body).toEqual(JSON.stringify({ userId: clientId , postContent: postContent }));
    });
  });
});
