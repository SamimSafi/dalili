import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { LogoForm } from './LogoForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
type logos = [
  {
    id: number;
    image: string;
  }
];
export const LogoList = () => {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleClose = () => {
    setShow(false);
    setEditMode(false);
  };
  const handleShow = () => setShow(true);
  const [logos, setLogos] = useState<logos>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [logo, setLogo] = useState({ id: 0, image: '' });

  const deleteLogo = (id) => {
    axios
      .delete(baseUrl + '/logo/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadLogo();
      });
  };
  const loadLogo = () => {
    axios
      .get(baseUrl + '/logo')
      .then((res) => setLogos(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadLogo();
  }, []);

  return (
    <>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Logo List</li>
        </ol>
        
        <div className="card mb-4">
          <div className="card-body">
            <Table striped bordered hover size="sm" className="items-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  {/* <th>Name</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logos &&
                  logos.map((res) => (
                    <tr>
                      <td>{res.id}</td>
                      <td>
                        <img
                          src={baseUrl + '/' + res.image}
                          alt={res.image}
                          className="rounded-circle"
                          style={{ width: '50px', height: '50px' }}
                        />
                      </td>
                      {/* <td>{res.image}</td> */}
                      <td>
                        <Link to={`/UpdateLogo/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        
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
          <Modal.Title>'Create Logo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            <LogoForm
              loadLogo={loadLogo}
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
            <strong className="me-auto">Logo Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
