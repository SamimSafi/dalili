import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function UpdateClients() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/clientsById/${id}`)
      .then((response) => {
        setName(response.data.name);
        setDescription(response.data.description);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', file!);
      const response = await axios.put(baseUrl + `/clients/` + id, formData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/client');
    }
  };

  return (
    <div className="container-fluid px-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Clients</a>
        </li>
        <li className="breadcrumb-item active">Update Clients</li>
      </ol>

      <Card>
        <Card.Header>Update Clients</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleServiceChange}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={handleDescriptionChange}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="file" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Image
              </label>
              <input
                type="file"
                id="file"
                name="image"
                onChange={handleFileChange}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
              />
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

            <Link to={'/client'}>
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

export default UpdateClients;
