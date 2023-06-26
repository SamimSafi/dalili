import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card, Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { IconPicker } from 'react-fa-icon-picker';

function UpdateReview() {
  const [userName, setUserName] = useState('');
  const [file, setFile] = useState<File | null>();
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/review/${id}`)
      .then((response) => {
        setUserName(response.data.userName);
        setRating(response.data.rating);
        setDescription(response.data.description);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userName', userName);
      formData.append('rating', rating);
      formData.append('description', description);
      formData.append('image', file!);
      const response = await axios.put(baseUrl + `/review/` + id, formData, {
        headers: {
          'Content-Type': 'multypart/form-data',
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/review');
    }
  };

  return (
    <div className="container-fluid px-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Hero</a>
        </li>
        <li className="breadcrumb-item active">Update Review</li>
      </ol>

      <Card>
        <Card.Header>Update Review</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="Name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Main Title
              </label>
              <input
                type="text"
                id="name"
                name="userName"
                value={userName}
                onChange={handleUserNameChange}
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

            <Link to={'/review'}>
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

export default UpdateReview;
