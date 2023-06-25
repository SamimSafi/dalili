import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';
import { IconPicker } from 'react-fa-icon-picker';

type OurContactFormProps = {
  loadOurContact: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const OurContactForm = ({
  loadOurContact,
  setShow,
  setToastMessage,
  setShowToast,
}: OurContactFormProps) => {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddresseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post(baseUrl + '/ourContact', { phone, address, email })
      .then((response) => {
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadOurContact();
        setShow(false);
      })
      .catch((error) => {
        console.error(error);
        setToastMessage('Error submitting form'); // Set a default error message in the toaster
        setShowToast(true); // Show the toaster
        // Handle submission error
      });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter Phone"
          />
        </Form.Group>
        <Form.Group controlId="link">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={address}
            onChange={handleAddresseChange}
            placeholder="Enter Address"
          />
        </Form.Group>
        <Form.Group controlId="icon">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="icon"
            value={email}
            placeholder="Select Email"
            onChange={handleEmailChange}
          />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
