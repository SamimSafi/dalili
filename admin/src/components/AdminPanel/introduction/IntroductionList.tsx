import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { IntroductionForm } from './IntroductionForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker';

type introduction = [
  {
    id: number;
    isCurrent: boolean;
    videoLink: string;
  }
];
export const IntroductionList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [introduction, setIntroduction] = useState<introduction>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const deleteIntroduction = (id:any) => {
    axios
      .delete(baseUrl + '/introduction/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadIntroduction();
      });
  };
  const loadIntroduction = () => {
    axios
      .get(baseUrl + '/introduction')
      .then((res) => setIntroduction(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadIntroduction();
  }, []);

  return (
    <>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Introduction List</li>
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
                  <th>isCurrent</th>
                  <th>Video Link</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {introduction &&
                  introduction.map((res) => (
                    <tr>
                      <td>{res.id}</td>
                      <td>{res.isCurrent}</td>
                      <td>{res.videoLink}</td>
                      <td>
                        <Link to={`/introduction/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        <Button variant="danger" onClick={() => deleteIntroduction(res.id)}>
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
          <Modal.Title>Create Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <IntroductionForm
            loadIntroduction={loadIntroduction}
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
            <strong className="me-auto">Introduction Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
