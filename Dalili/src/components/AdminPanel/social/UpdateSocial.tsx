import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { IconPicker } from 'react-fa-icon-picker'

function UpdateSocial() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState< File | null>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/socialIconById/${id}`)
      .then((response) => {
        setName(response.data.name);
        setUrl(response.data.link);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  // const handleDescriptionChange = (event) => {
  //   setDescription(event.target.value);
  // };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('link', url);
      formData.append('image', file!);
       await axios.put(baseUrl + `/socialIcon/` + id, formData);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/socialIcon');
    }
  };

  return (
    <div className="container-fluid px-4">
                        <ol className="breadcrumb mb-4">
                            <li className="breadcrumb-item"><a href="index.html">Services</a></li>
                            <li className="breadcrumb-item active">Update Social Icon</li>
                        </ol>
      
      <Card>
      <Card.Header>Update Social Icon</Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="Name" style={{ display: 'block', marginBottom: '0.5rem' }}>
           Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            style={{
              border: '1px solid #D1D5DB',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              width: '100%',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="URL" style={{ display: 'block', marginBottom: '0.5rem' }}>
              URL
            </label>
            <input
              type="text"
              id="title"
              name="link"
              value={url!}
              onChange={handleUrlChange}
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
            style={{ border: '1px solid #D1D5DB', borderRadius: '0.25rem', padding: '0.5rem',width: '100%', }}
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

       
        <Link to={"/services"}>

        <button
          style={{
            backgroundColor: 'orange',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            marginLeft:2
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

export default UpdateSocial;
