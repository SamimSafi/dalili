import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Constaints/baseUrl';
import { Badge, Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { IconPicker } from 'react-fa-icon-picker';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function UpdateHoWeHelp() {
  const [file, setFile] = useState<File | null>();
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the existing record data from the API
    axios
      .get(baseUrl + `/howWeHelpById/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setIcon(response.data.icon);
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

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIcon(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('icon', icon);
      formData.append('title', title);
      formData.append('description', description);
      const response = await axios.put(baseUrl + `/howWeHelp/` + id, {title,description,icon});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigate('/howWeHelp');
    }
  };

  return (
    <div className="container-fluid px-4">
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <a href="index.html">Feature</a>
        </li>
        <li className="breadcrumb-item active">Update Feature</li>
      </ol>

      <Card>
        <Card.Header>Update Feature</Card.Header>
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

            <div style={{ marginBottom: '1rem' }}>
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
              
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="icon" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Icon
              </label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={icon}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  width: '100%',
                }}
                onChange={handleIconChange}
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

            <Link to={'/howWeHelp'}>
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
          <div className="container mt-5 ml-0">
      <h1>Icons Guide</h1>
      <p>To find the icon class , visit the <a href="https://fontawesome.com/v4/icons/" target="_blank">FontAwesome website</a></p>
      <p>Here's an example of how to use a FontAwesome icon:</p>
      <i className="fa fa-check"></i> This is a checkmark icon. copy only this part <Badge  color="warning">fa-check</Badge>
    </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UpdateHoWeHelp;
