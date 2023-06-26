import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card, Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { IconPicker } from 'react-fa-icon-picker';

function UpdateShortAboutUs() {
  const [file, setFile] = useState<File | null>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/shortAboutUsById/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        // setFile(response.data.icon);
        setDescription(response.data.description);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', file!);
      const response = await axios.put(baseUrl + `/shortAboutUs/` + id, formData, {
        headers: {
          'Content-Type': 'multypart/form-data',
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/shortAboutUs');
    }
  };

  return (
    <div className="container-fluid px-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Gallery</a>
        </li>
        <li className="breadcrumb-item active">Update Gallery</li>
      </ol>

      <Card>
        <Card.Header>Update Gallery</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="Name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Title
              </label>
              <input
                type="text"
                id="name"
                name="title"
                value={title}
                onChange={handleTitleChange}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
              />
            </div>

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

            {/* <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="file" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Description
              </label>
              <input
                type="text"
                id="title"
                name="description"
                value={description}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
                onChange={handleDescriptionChange}
              />
            </div> */}

            <div style={{ marginBottom: '1rem' }}>
              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="image" onChange={handleFileChange} />
              </Form.Group>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>

            <Link to={'/shortAboutUs'}>
              <button
                style={{
                  backgroundColor: 'orange',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  marginLeft: 2,
                }}
              >
                Back
              </button>
            </Link>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UpdateShortAboutUs;
