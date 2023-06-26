import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';
import { IconPicker } from 'react-fa-icon-picker';

type IntroductionFormProps = {
  loadIntroduction: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const IntroductionForm = ({
  loadIntroduction,
  setShow,
  setToastMessage,
  setShowToast,
}: IntroductionFormProps) => {
  const [isCurrent, setIsCurrent] = useState(Boolean);
  const [videolink, setVideoLink] = useState('');
  const handleIsCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrent(event.target.checked);
  };

  const handleVideoLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
console.log(videolink)
    axios
      .post(baseUrl + '/introduction', { isCurrent, videolink })
      .then((response) => {
        console.log(response.data);
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadIntroduction();
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
        
        <Form.Group controlId="link">
          <Form.Label>Video Link</Form.Label>
          <Form.Control
            type="text"
            name="videoLink"
            value={videolink}
            onChange={handleVideoLinkChange}
            placeholder="Enter Social Link"
          />
        </Form.Group>

        <Form.Group className=" mt-3"  controlId="name">
        <Form.Check type="checkbox" name='isCurrent' checked={isCurrent} onChange={handleIsCurrentChange} label="Is Current" />
        </Form.Group>

        <Button variant="primary" className="mt-4" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
