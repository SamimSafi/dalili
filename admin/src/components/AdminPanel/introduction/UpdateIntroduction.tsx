import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function UpdateIntroduction() {
  const [isCurrent, setIsCurrent] = useState(Boolean);
  const [videolink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleIsCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrent(true);
  };

  const handleVideoLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(event.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/introductionById/${id}`)
      .then((response) => {
        console.log(response.data.isCurrent)
        setIsCurrent(response.data.isCurrent);
        setVideoLink(response.data.videoLink);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(baseUrl + `/introduction/` + id, { isCurrent, videolink });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/introduction');
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Static Navigation</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Services</a>
        </li>
        <li className="breadcrumb-item active">Update Introduction</li>
      </ol>

      <Card>
        <Card.Header>Update Introduction</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className=" mt-3"  controlId="name">
        <Form.Check type="checkbox" name='isCurrent' checked={isCurrent} onChange={handleIsCurrentChange} label="Is Current" />
        </Form.Group>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="videoLink" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Video Link
              </label>
              <input
                type="text"
                id="videoLink"
                name="videoLink"
                value={videolink}
                onChange={handleVideoLinkChange}
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

            <Link to={'/introduction'}>
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

export default UpdateIntroduction;
