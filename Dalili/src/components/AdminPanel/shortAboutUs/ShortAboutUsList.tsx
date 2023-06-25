import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { ShortAboutUsForm } from './ShortAboutUsForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker';

type ShortAboutUs = [
  {
    id: number;
    title: string;
    description: string;
    image: string;
  }
];
export const ShortAboutUsList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [shortAboutUs, setShortAboutUs] = useState<ShortAboutUs>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [iconToDelete, setIconToDelete] = useState();

  const deleteShortAboutUs = (id) => {
    axios
      .delete(baseUrl + '/shortAboutUs/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadShortAboutUs();
      });
  };
  const loadShortAboutUs = () => {
    axios
      .get(baseUrl + '/shortAboutUs')
      .then((res) => setShortAboutUs(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadShortAboutUs();
  }, []);

  const handleDeleteIcon = (icon) => {
    setIconToDelete(icon);
    setShowDeleteModal(true);
  };

  const confirmDeleteIcon = () => {
    deleteShortAboutUs(iconToDelete);
    setShowDeleteModal(false);
  };

  const cancelDeleteIcon = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <Modal show={showDeleteModal} onHide={cancelDeleteIcon}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteIcon}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteIcon}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Gallery</li>
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shortAboutUs &&
                  shortAboutUs.map((res, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={baseUrl + '/' + res.image}
                          alt={res.title}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px' }}
                        />
                      </td>
                      <td>{res.title}</td>
                      <td>{res.description}</td>
                      <td>
                        <Link to={`/shortAboutUs/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        <Button variant="danger" onClick={() => handleDeleteIcon(res.id)}>
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
          <Modal.Title>Create Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ShortAboutUsForm
            loadShortAboutUs={loadShortAboutUs}
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
            <strong className="me-auto">Gallery Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
