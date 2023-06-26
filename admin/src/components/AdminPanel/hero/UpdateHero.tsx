import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { IconPicker } from 'react-fa-icon-picker';

function UpdateHero() {
  const [file, setFile] = useState<File | null>();
  const [mainTitle, setMainTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/heroById/${id}`)
      .then((response) => {
        setMainTitle(response.data.main_title);
        setSubTitle(response.data.sub_title);
        setPhoneNo(response.data.phone_no);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleMainTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMainTitle(event.target.value);
  };

  const handleSubTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTitle(event.target.value);
  };

  const handlePhoneNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNo(event.target.value);
  };

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('main_title', mainTitle);
      formData.append('sub_title', subTitle);
      formData.append('phone_no', phoneNo);
      formData.append('image', file!);
      const response = await axios.put(baseUrl + `/hero/` + id, formData, {
        headers: {
          'Content-Type': 'multypart/form-data',
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/hero');
    }
  };

  return (
    <div className="container-fluid px-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Hero</a>
        </li>
        <li className="breadcrumb-item active">Update Hero</li>
      </ol>

      <Card>
        <Card.Header>Update Hero</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="Name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Main Title
              </label>
              <input
                type="text"
                id="name"
                name="main_title"
                value={mainTitle}
                onChange={handleMainTitleChange}
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
                Sub Title
              </label>
              <input
                type="text"
                id="sub_title"
                name="sub_title"
                value={subTitle}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
                onChange={handleSubTitleChange}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="file" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Phone No
              </label>
              <input
                type="text"
                id="phone_no"
                name="phone_no"
                value={phoneNo}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
                onChange={handlePhoneNoChange}
              />
            </div>
             <div style={{marginBottom:'1rem'}}>
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

            <Link to={'/hero'}>
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

export default UpdateHero;
