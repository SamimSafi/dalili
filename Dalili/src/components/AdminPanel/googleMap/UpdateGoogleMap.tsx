import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function UpdateGoogleMap() {
  const [googleMap, setGoogleMap] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // const handleIsCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsCurrent(true);
  // };

  const handleGoogleMapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleMap(event.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/googleMapById/${id}`)
      .then((response) => {
        setGoogleMap(response.data.contents);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(baseUrl + `/googleMap/` + id, { googleMap });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/googleMap');
    }
  };

  return (
    <div className="container-fluid px-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Google Map</a>
        </li>
        <li className="breadcrumb-item active">Update Google Map</li>
      </ol>

      <Card>
        <Card.Header>Update Google Map</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="contents" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Google Map
              </label>
              <input
                type="text"
                id="contents"
                name="contents"
                value={googleMap}
                onChange={handleGoogleMapChange}
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

            <Link to={'/googleMap'}>
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

export default UpdateGoogleMap;
