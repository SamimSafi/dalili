import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { ReviewForm } from './ReviewForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker';

type IHero = [
  {
    id: number;
    userName: string;
    rating: string;
    description: string;
    image: string;
  }
];
export const ReviewList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [review, setReview] = useState<IHero>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [iconToDelete, setIconToDelete] = useState();

  const deleteReview = (id:any) => {
    axios
      .delete(baseUrl + '/review/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadReview();
      });
  };
  const loadReview = () => {
    axios
      .get(baseUrl + '/review')
      .then((res) => setReview(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadReview();
  }, []);

  const handleDeleteIcon = (icon:any) => {
    setIconToDelete(icon);
    setShowDeleteModal(true);
  };

  const confirmDeleteIcon = () => {
    deleteReview(iconToDelete);
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
          <li className="breadcrumb-item active">Review List</li>
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
                  <th style={{ width: 50 }}>#</th>
                  <th style={{ width: 150 }}>Image</th>
                  <th style={{ width: 140 }}>User Name</th>
                  <th>Rating</th>
                  <th>Description </th>
                  <th style={{ width: 200 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {review &&
                  review.map((res, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={baseUrl + '/' + res.image}
                          alt={res.image}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px' }}
                        />
                      </td>
                      <td>{res.userName}</td>
                      <td>{res.rating}</td>
                      <td>{res.description}</td>
                      <td>
                        <Link to={`/review/${res.id}`}>
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
          <Modal.Title>Create Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReviewForm
            loadReview={loadReview}
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
            <strong className="me-auto">Hero Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
