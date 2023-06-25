import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../Constaints/baseUrl';
import { IconPicker } from 'react-fa-icon-picker';

type ServiceFormProps = {
  loadSocial: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const SocialForm = ({
  loadSocial,
  setShow,
  setToastMessage,
  setShowToast,
}: ServiceFormProps) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [icon, setIcon] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post(baseUrl + '/socialIcon', { name, link, icon })
      .then((response) => {
        console.log(response.data);
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadSocial();
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
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter Name"
          />
        </Form.Group>
        <Form.Group controlId="link">
          <Form.Label>Link</Form.Label>
          <Form.Control
            type="text"
            name="link"
            value={link}
            onChange={handleLinkChange}
            placeholder="Enter Social Link"
          />
        </Form.Group>
        <Form.Group controlId="icon">
          <Form.Label>Icon</Form.Label>
          <Form.Control type="text" name="icon" value={icon} placeholder="Select Icon" />
          <IconPicker
            value={icon}
            onChange={(icon) => {
              setIcon(icon);
            }}
          />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
