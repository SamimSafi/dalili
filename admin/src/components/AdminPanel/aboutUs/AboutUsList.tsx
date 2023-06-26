import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { AboutUsForm } from './AboutUsForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';

type aboutus = [
  {
    id: number;
    content: string;
  }
];
export const AboutUsList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [aboutUs, setAboutUs] = useState<aboutus>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const deleteAboutUs = (id:any) => {
    axios
      .delete(baseUrl + '/aboutUs/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadAboutUs();
      });
  };
  const loadAboutUs = () => {
    axios
      .get(baseUrl + '/aboutUs')
      .then((res) => setAboutUs(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadAboutUs();
  }, []);

  return (
    <>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">ABoutus List</li>
        </ol>
        <div className="text-end">
          <Button variant="primary" className="mb-2 position" onClick={handleShow}>
            Create New
          </Button>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <Table striped bordered hover size="sm" className="items-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Content</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {aboutUs &&
                  aboutUs.map((res) => (
                    <tr>
                      <td>{res.id}</td>
                      <td>{res.content}</td>
                      <td>
                        <Link to={`/aboutUs/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        <Button variant="danger" onClick={() => deleteAboutUs(res.id)}>
                          Delete
                        </Button>{' '}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} style={{ marginTop: '10%' }}>
        <Modal.Header closeButton>
          <Modal.Title>Create Aboutus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AboutUsForm
            loadAboutUs={loadAboutUs}
            setShow={setShow}
            setShowToast={setShowToast}
            setToastMessage={setToastMessage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Aboutus Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
