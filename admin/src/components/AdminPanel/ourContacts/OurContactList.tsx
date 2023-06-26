import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { OurContactForm } from './OurContactForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker';

type ourContact = [
  {
    id: number;
    phone: string;
    address: string;
    email: string;
  }
];
export const OurContactList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [ourContact, setOurContact] = useState<ourContact>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [iconToDelete, setIconToDelete] = useState();

  const deleteOurContact = (id:any) => {
    axios
      .delete(baseUrl + '/ourContact/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadOurContact();
      });
  };
  const loadOurContact = () => {
    axios
      .get(baseUrl + '/ourContact')
      .then((res) => setOurContact(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadOurContact();
  }, []);

  const handleDeleteIcon = (icon:any) => {
    setIconToDelete(icon);
    setShowDeleteModal(true);
  };

  const confirmDeleteIcon = () => {
    deleteOurContact(iconToDelete);
    setShowDeleteModal(false);
  };

  const cancelDeleteIcon = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <Modal show={showDeleteModal} onHide={cancelDeleteIcon}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Review</Modal.Title>
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
          <li className="breadcrumb-item active">Our Contact List</li>
        </ol>
        {/* <div className="text-end">
          <Button variant="primary" className="mb-2 position" onClick={handleShow}>
            Create New
          </Button>
        </div> */}
        <div className="card mb-4">
          <div className="card-body">
            <Table striped bordered hover size="sm" className="items-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ourContact &&
                  ourContact.map((res) => (
                    <tr>
                      <td>{res.id}</td>
                      <td>{res.phone}</td>
                      <td>{res.address}</td>
                      <td>{res.email}</td>
                      <td>
                        <Link to={`/ourContact/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        {/* <Button variant="danger" onClick={() => handleDeleteIcon(res.id)}>
                          Delete
                        </Button>{' '} */}
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
          <Modal.Title>Create Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OurContactForm
            loadOurContact={loadOurContact}
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
            <strong className="me-auto">Our Contact Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
