import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';

type ShortAboutUsFormProps = {
  loadShortAboutUs: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const ShortAboutUsForm = ({
  loadShortAboutUs,
  setShow,
  setToastMessage,
  setShowToast,
}: ShortAboutUsFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
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
    formData.append('image', file!);
    axios
      .post(baseUrl + `/shortAboutUs/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadShortAboutUs();
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

        <div style={{ marginTop: '1rem' }}>
          <InputGroup>
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control
              name="description"
              onChange={handleDescriptionChange}
              placeholder="Enter Description"
              value={description}
              as="textarea"
            />
          </InputGroup>
        </div>

        {/* <Form.Group controlId="icon">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={description}
            placeholder="Enter Description"
            onChange={handleDescriptionChange}
          />
        </Form.Group> */}

        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleFileChange} />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
