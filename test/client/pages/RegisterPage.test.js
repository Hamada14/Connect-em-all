import React from "react";
import { shallow, mount } from 'enzyme';
import { Form, Modal, Button, ListGroup } from 'react-bootstrap';

import RegisterPage from "client/pages/RegisterPage";

describe("Register Page UI", () => {

  let wrapper;

  beforeAll(() => {
    wrapper = mount(<RegisterPage />);
  });

  describe('Form Labels', () => {

    let formLabels;
    beforeAll(() => {
      formLabels = wrapper.find(Form.Label);
    });

    it('Contains labels for five inputs', () => {
      expect(formLabels.length).toEqual(5)
    });

    it('Form labels have the correct text', () => {
      const expectedLabels = ['Email address', 'Password', 'Confirm Password', 'Full Name', 'Birthday'];
      for(let index = 0; index < expectedLabels.length; index++) {
        expect(formLabels.get(index).props.children).toEqual(expectedLabels[index]);
      }
    });
  })

  describe('Form Inputs', () => {
    let formInputs;

    beforeAll(() => {
      formInputs = wrapper.find(Form.Control);
    });


    it('Contains five inputs', () => {
      expect(formInputs.length).toEqual(5);
    });

    it('Form inputs have the correct placeholder', () => {
      const expectedPlaceholders = ['Email', 'Password', 'Confirm Password',
        'Full Name']; // The fifth input is a date and doesn't have a placeholder.
      for(let index = 0; index < expectedPlaceholders.length; index++) {
        expect(formInputs.get(index).props.placeholder).toEqual(expectedPlaceholders[index]);
      }
    });
  });
});


const genericData = {
  email: 'email',
  password: 'password',
  confirmPassword: 'password2',
  fullName: 'fullname',
  birthdate: 'date'
};

describe("Register Page Logic", () => {

  function submitGenericInputs(wrapper) {
    const formInputs = wrapper.find(Form.Control);
    const values = Object.values(genericData);
    for(let index = 0; index < values.length; index++) {
      formInputs.at(index).simulate('change', {
        target: { value: values[index] }
      });
    }

    wrapper.find(Button).simulate('click');
  }


  const flushPromises = () => {
    return new Promise(resolve => setImmediate(resolve));
  };

  describe('On Clicking Submit', () => {

    let callParams;

    let wrapper;

    beforeEach(() => {
      wrapper = mount(<RegisterPage />);
      const mockSuccessResponse = {errors: []};
      const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
      const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
      });
      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); //

      submitGenericInputs(wrapper);
      callParams = global.fetch.mock.calls[0];
    });

    it('sends a request once', () => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('sends a request to /api/register', () => {
      expect(callParams[0]).toEqual('/api/register');
    });

    it('sends a post request', () => {
      expect(callParams[1].method).toEqual('POST');
    });

    it('sends the submitted parameters', () => {
      expect(callParams[1].body).toEqual(JSON.stringify(genericData));
    });
  });


  describe('On Successful Registeration', () => {

    let wrapper;

    beforeEach(() => {
      wrapper = mount(<RegisterPage />);
      const mockSuccessResponse = {errors: []};
      const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
      const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
      });
      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); //
    });

    it('Hide the modal before submitting', () => {
      expect(wrapper.find(Modal).get(0).props.show).toBeFalsy();
    });

    it('Sends a request to /api/register on Clicking submit', () => {
      submitGenericInputs(wrapper);
      const callParams = global.fetch.mock.calls[0];
      expect(callParams[0]).toEqual('/api/register');
    });

    it('Displays the modal after successful registeration', async () => {
      submitGenericInputs(wrapper);
      await flushPromises();
      wrapper.update();
      expect(wrapper.find(Modal).get(0).props.show).toBeTruthy();
    });
  });

  describe('On Failed Registeration', () => {

    let wrapper;

    const expectedErrors = ['error1', 'error2']

    beforeEach(() => {
      wrapper = mount(<RegisterPage />);
      const mockSuccessResponse = {errors: expectedErrors};
      const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
      const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
      });
      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); //
    });

    it('Hide the modal before submitting', () => {
      expect(wrapper.find(Modal).props.show).toBeFalsy();
    });

    it('Sends a request to /api/register on Clicking submit', () => {
      submitGenericInputs(wrapper);
      const callParams = global.fetch.mock.calls[0];
      expect(callParams[0]).toEqual('/api/register');
    });

    it('Does not displays the modal', async () => {
      submitGenericInputs(wrapper);
      await flushPromises();
      wrapper.update();
      expect(wrapper.find(Modal).get(0).props.show).toBeFalsy();
    });

    it('Displays the errors', async () => {
      submitGenericInputs(wrapper);
      await flushPromises();
      wrapper.update();

      const listErrors = wrapper.find(ListGroup.Item);

      for(let index = 0; index < expectedErrors.length; index++) {
        expect(listErrors.at(index).text()).toEqual(expectedErrors[index]);
      }
    })
  });
});
