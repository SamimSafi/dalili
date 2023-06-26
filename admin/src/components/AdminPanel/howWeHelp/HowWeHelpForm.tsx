import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';
import { IconPicker } from 'react-fa-icon-picker';

type HowWeHelpFormProps = {
  loadHowWeHelp: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const HowWeHelpForm = ({
  loadHowWeHelp,
  setShow,
  setToastMessage,
  setShowToast,
}: HowWeHelpFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [icon, setIcon] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
 
  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIcon(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('icon', icon);
    axios
      .post(baseUrl + `/howWeHelp/`, {title,description,icon})
      .then((response) => {
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadHowWeHelp();
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
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter Title"
          />
        </Form.Group> 
        <Form.Group controlId="icon">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={description}
            placeholder="Enter Description"
            onChange={handleDescriptionChange}
          />
        </Form.Group>
        <Form.Group controlId="icon">
          <Form.Label>Icon</Form.Label>
          <Form.Control
            type="text"
            name="icon"
            value={description}
            placeholder="Enter Icon Class"
            onChange={handleIconChange}
          />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
