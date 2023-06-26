import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { ServiceForm } from './ServiceForm';
import Toast from 'react-bootstrap/Toast';
import { ServiceUpdate } from './ServiceUpdate';
import { Link } from 'react-router-dom';
type services = [
  {
    id: number;
    image: string;
    serviceName: string;
  }
];
export const ServiceList = () => {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleClose = () => {
    setShow(false);
    setEditMode(false);
  };
  const handleShow = () => setShow(true);
  const [services, setServices] = useState<services>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [service, setService] = useState({ id: 0, image: '', serviceName: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [iconToDelete, setIconToDelete] = useState();

  const getServicesForEdit = (id: number) => {
    setEditMode(true);
    axios
      .get(baseUrl + `/servicesById/${id}`)
      .then((response) => {
        setService(response.data);
      })
      .finally(() => {
        console.log(service.image);
        handleShow();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteServices = (id) => {
    axios
      .delete(baseUrl + '/services/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadServices();
      });
  };
  const loadServices = () => {
    axios
      .get(baseUrl + '/services')
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadServices();
  }, []);

  const handleDeleteIcon = (icon) => {
    setIconToDelete(icon);
    setShowDeleteModal(true);
  };

  const confirmDeleteIcon = () => {
    deleteServices(iconToDelete);
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
          <li className="breadcrumb-item active">Services List</li>
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
                  <th>Service Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services &&
                  services.map((res, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={baseUrl + '/' + res.image}
                          alt={res.serviceName}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px' }}
                        />
                      </td>
                      <td>{res.serviceName}</td>
                      <td>
                        <Link to={`/UpdateService/${res.id}`}>
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
          <Modal.Title>{editMode ? 'Update Service' : 'Create Service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <ServiceUpdate
              initialValues={service}
              loadServices={loadServices}
              setShow={setShow}
              setShowToast={setShowToast}
              setToastMessage={setToastMessage}
            />
          ) : (
            <ServiceForm
              loadServices={loadServices}
              setShow={setShow}
              setShowToast={setShowToast}
              setToastMessage={setToastMessage}
            />
          )}
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
            <strong className="me-auto">Service Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
