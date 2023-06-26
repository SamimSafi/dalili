import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function UpdateAboutUs() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleContentChange = (event:any) => {
    setContent(event.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/aboutUsById/${id}`)
      .then((response) => {
        setContent(response.data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  //   setDescription(event.target.value);
  // };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(baseUrl + `/aboutUs/` + id, { content });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/aboutUs');
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Static Navigation</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Aboutus</a>
        </li>
        <li className="breadcrumb-item active">Update Aboutus</li>
      </ol>

      <Card>
        <Card.Header>Update Aboutus</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="Name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Content
              </label>
              <input
                type="text"
                id="content"
                name="content"
                value={content}
                onChange={handleContentChange}
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

            <Link to={'/services'}>
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

export default UpdateAboutUs;
