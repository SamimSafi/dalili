import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';

type HeroFormProps = {
  loadHero: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const HeroForm = ({
  loadHero,
  setShow,
  setToastMessage,
  setShowToast,
}: HeroFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [mainTitle, setMainTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const handleMainTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMainTitle(event.target.value);
  };

  const handleSubTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTitle(event.target.value);
  };


  const handlePhoneNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNo(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('main_title', mainTitle);
    formData.append('sub_title', subTitle);
    formData.append('phone_no', phoneNo);
    formData.append('image', file!);
    axios
      .post(baseUrl + `/hero/`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadHero();
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
        <Form.Group controlId="main_title">
          <Form.Label>Main Title</Form.Label>
          <Form.Control
            type="text"
            name="main_title"
            value={mainTitle}
            onChange={handleMainTitleChange}
            placeholder="Enter Main Title"
          />
        </Form.Group>

        <Form.Group controlId="sub_title">
          <Form.Label>Sub Title</Form.Label>
          <Form.Control
            type="text"
            name="sub_title"
            value={subTitle}
            placeholder="Enter Sub Title"
            onChange={handleSubTitleChange}
          />
        </Form.Group>
        
        <Form.Group controlId="phone_no">
          <Form.Label>Phone No</Form.Label>
          <Form.Control
            type="text"
            name="phone_no"
            value={phoneNo}
            placeholder="Enter Phone No"
            onChange={handlePhoneNoChange}
          />
        </Form.Group>

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
