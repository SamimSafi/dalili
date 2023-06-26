import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { HowWeHelpForm } from './HowWeHelpForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker';

type howWeHelp = [
  {
    id: number;
    icon: string;
    title: string;
    description: string;
  }
];
export const HowWeHelpList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [howWeHelp, setHowWeHelp] = useState<howWeHelp>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const deleteHowWeHelp = (id) => {
    axios
      .delete(baseUrl + '/howWeHelp/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadHowWeHelp();
      });
  };
  const loadHowWeHelp = () => {
    axios
      .get(baseUrl + '/howWeHelp')
      .then((res) => setHowWeHelp(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadHowWeHelp();
  }, []);

  return (
    <>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Features</li>
        </ol>
        <div className="text-end">
          {/* <Button variant="primary" className='mb-2 position' onClick={handleShow}>
        Create New
      </Button> */}
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <Table striped bordered hover size="sm" className="items-center">
              <thead>
                <tr>
                  <th style={{width:80}}>#</th>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th style={{width:140}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {howWeHelp &&
                  howWeHelp.map((res,index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                     {res.icon}
                      </td>
                      <td>{res.title}</td>
                      <td>{res.description}</td>
                      <td>
                        <Link to={`/howWeHelp/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        {/* <Button variant="danger" onClick={() => deleteHowWeHelp(res.id)}>
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
          <Modal.Title>Create How We Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HowWeHelpForm
            loadHowWeHelp={loadHowWeHelp}
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
            <strong className="me-auto">How We Help Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
