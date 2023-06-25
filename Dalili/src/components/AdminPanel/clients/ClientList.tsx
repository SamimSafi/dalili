import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { ClientForm } from './ClientForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
type clients = [
  {
    id: number;
    name: string;
    description: string;
    image: string;
  }
];
export const ClientList = () => {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleClose = () => {
    setShow(false);
    setEditMode(false);
  };
  const handleShow = () => setShow(true);
  const [clients, setClients] = useState<clients>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const deleteClients = (id) => {
    axios
      .delete(baseUrl + '/clients/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadClients();
      });
  };
  const loadClients = () => {
    axios
      .get(baseUrl + '/clients')
      .then((res) => setClients(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadClients();
  }, []);

  return (
    <>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Clients List</li>
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
                  <th>Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clients &&
                  clients.map((res) => (
                    <tr>
                      <td>{res.id}</td>
                      <td>
                        <img
                          src={baseUrl + '/' + res.image}
                          alt={res.name}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px' }}
                        />
                      </td>
                      <td>{res.name}</td>
                      <td>{res.description}</td>
                      <td>
                        <Link to={`/client/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        <Button variant="danger" onClick={() => deleteClients(res.id)}>
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
          <Modal.Title>Create Clients</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            <ClientForm
              loadServices={loadClients}
              setShow={setShow}
              setShowToast={setShowToast}
              setToastMessage={setToastMessage}
            />
          }
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
            <strong className="me-auto">Client Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
