import React, { useState } from 'react';
import { Form, Button, FormGroup, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';

type HeroFormProps = {
  loadReview: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const ReviewForm = ({
  loadReview,
  setShow,
  setToastMessage,
  setShowToast,
}: HeroFormProps) => {
  const [userName, setUserName] = useState('');
  const [file, setFile] = useState<File | null>();
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(event.target.value);
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
    formData.append('userName', userName);
    formData.append('image', file!);
    formData.append('rating', rating);
    formData.append('description', description);
    axios
      .post(baseUrl + `/review/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadReview();
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
        <Form.Group controlId="userName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            value={userName}
            onChange={handleUserNameChange}
            placeholder="Enter User Name"
          />
        </Form.Group>
        {/* 
        <Form.Group controlId="rating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="text"
            name="rating"
            value={rating}
            placeholder="Enter Rating"
            onChange={handleRatingChange}
          />
        </Form.Group> */}

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

        {/* <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>

          <Form.Control
            type="textarea"
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
