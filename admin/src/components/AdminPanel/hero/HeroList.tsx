import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { HeroForm } from './HeroForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker';

type IHero = [
  {
    id: number;
    main_title: string;
    sub_title: string;
    phone_no: string;
    image: string;
  }
];
export const HeroList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [hero, setHero] = useState<IHero>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const deleteHero = (id:any) => {
    axios
      .delete(baseUrl + '/hero/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadHero();
      });
  };
  const loadHero = () => {
    axios
      .get(baseUrl + '/hero')
      .then((res) => setHero(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadHero();
  }, []);

  return (
    <>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Hero List</li>
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
                  <th>Image</th>
                  <th>Main Title</th>
                  <th>Sub Title</th>
                  <th>Phone No </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {hero &&
                  hero.map((res) => (
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
                      <td>{res.main_title}</td>
                      <td>{res.sub_title}</td>
                      <td>{res.phone_no}</td>
                      <td>
                        <Link to={`/hero/${res.id}`}>
                          {' '}
                          <Button variant="warning">Edit</Button>
                        </Link>{' '}
                        {/* <Button variant="danger" onClick={() => deleteHero(res.id)}>
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
          <Modal.Title>Create Hero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HeroForm
            loadHero={loadHero}
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
