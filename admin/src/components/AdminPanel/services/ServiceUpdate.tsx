import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../../Constaints/baseUrl';

  type services={
    id:number;
    image:string;
    serviceName:string;
};
type ServiceFormProps = {
    loadServices: () => void;
    setToastMessage: (message:string) => void;
    setShowToast: (show: boolean) => void;
    setShow: (show: boolean) => void;
    initialValues:{id:number;image:string; serviceName:string}
  };

  interface FormData {
    serviceName: string;
    image: File | null;
  }

export const ServiceUpdate = ({loadServices,setShow,setToastMessage,setShowToast,initialValues}:ServiceFormProps) => {
    const [image, setImage] = useState<File | null>();
    const [serviceName, setServiceName] = useState(initialValues?.serviceName || '');
    const [formData, setFormData] = useState<FormData>({
        serviceName: initialValues?.serviceName || '',
        image: null,
      });
    
      // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      //   if (event.target.files) {
      //     setImage(event.target.files[0]);
      //   }
      // };

      
      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.type === 'file' ? target.files?.[0] : target.value;
        const name = target.name;
    
        setFormData({
          ...formData,
          [name]: value,
        });
      };


      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const formDataToSend = new FormData();
        formDataToSend.append('serviceName', formData.serviceName);
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }
    
        axios.put(baseUrl + `/services/${initialValues.id}`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            console.log(response.data);
            setToastMessage(response.data.message); // Set the message from the response in the toaster
            setShowToast(true); // Show the toaster
            loadServices();
            setShow(false);
          })
          .catch(error => {
            console.error(error);
            setToastMessage('Error submitting form'); // Set a default error message in the toaster
            setShowToast(true); // Show the toaster
            // Handle submission error
          });
      };

      
  return (
    <>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="serviceName">
        <Form.Label>Service Name</Form.Label>
        <Form.Control
          type="text"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleInputChange}
          placeholder="Enter service name"
        />
      </Form.Group>

      <Form.Group controlId="image">
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="file"
          name="image"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button variant="primary" className='mt-4' onClick={()=>{console.log(initialValues.serviceName)}}>
        Submit
      </Button>
    </Form>
  
    </>
  )
}
