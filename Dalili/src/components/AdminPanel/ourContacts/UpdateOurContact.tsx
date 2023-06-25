import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { IconPicker } from 'react-fa-icon-picker';

function UpdateOurContact() {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleAddresseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/ourContactById/${id}`)
      .then((response) => {
        setPhone(response.data.phone);
        setAddress(response.data.address);
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(baseUrl + `/ourContact/` + id, { phone, address, email });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/ourContact');
    }
  };

  return (
    <div className="container-fluid px-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Our Contact</a>
        </li>
        <li className="breadcrumb-item active">Update Our Contact</li>
      </ol>

      <Card>
        <Card.Header>Update Our Contact</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="Name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Phone
              </label>
              <input
                type="text"
                id="name"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="Address" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Address
              </label>
              <input
                type="text"
                id="title"
                name="address"
                value={address}
                onChange={handleAddresseChange}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="text"
                id="title"
                name="email"
                value={email}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
                onChange={handleEmailChange}
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

export default UpdateOurContact;
