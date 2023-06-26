import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';
import { IconPicker } from 'react-fa-icon-picker';

type GoogleMapFormProps = {
  loadGoogleMap: () => void;
  setToastMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const GoogleMapForm = ({
  loadGoogleMap,
  setShow,
  setToastMessage,
  setShowToast,
}: GoogleMapFormProps) => {
  //const [isCurrent, setIsCurrent] = useState(Boolean);
  const [googleMap, setGoogleMap] = useState('');

  // const handleIsCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsCurrent(event.target.checked);
  // };

  const handleGoogleMapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleMap(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(baseUrl + '/googleMap', {  googleMap })
      .then((response) => {
        console.log(response.data);
        setToastMessage(response.data.message); // Set the message from the response in the toaster
        setShowToast(true); // Show the toaster
        loadGoogleMap();
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
          <Form.Label>Google Map</Form.Label>
          <Form.Control
            type="text"
            name="contents"
            value={googleMap}
            onChange={handleGoogleMapChange}
            placeholder="Enter Google Map"
          />
        </Form.Group>

        {/* <Form.Group className=" mt-3"  controlId="name">
        <Form.Check type="checkbox" name='isCurrent' checked={isCurrent} onChange={handleIsCurrentChange} label="Is Current" />
        </Form.Group> */}

        <Button variant="primary" className="mt-4" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
