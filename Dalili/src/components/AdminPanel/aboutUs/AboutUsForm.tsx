import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';
import { IconPicker } from 'react-fa-icon-picker';

type ServiceFormProps = {
  loadAboutUs: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const AboutUsForm = ({
  loadAboutUs,
  setShow,
  setToastMessage,
  setShowToast,
}: ServiceFormProps) => {
  const [content, setContent] = useState('');

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post(baseUrl + '/aboutUs', { content })
      .then((response) => {
        console.log(response.data);
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadAboutUs();
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
        <Form.Group controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            type="text"
            name="content"
            value={content}
            onChange={handleContentChange}
            placeholder="Enter Content"
          />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
