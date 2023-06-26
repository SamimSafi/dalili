import React, { useEffect, useState } from 'react';
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import { GoogleMapForm } from './GoogleMapForm';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker';

type IGoogleMap = [
  {
    id: number;
    contents: string;
  }
];
export const GoogleMapList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [googleMap, setGoogleMap] = useState<IGoogleMap>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const deleteGoogleMap = (id:any) => {
    axios
      .delete(baseUrl + '/googleMap/' + id)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loadGoogleMap();
      });
  };
  const loadGoogleMap = () => {
    axios
      .get(baseUrl + '/googleMap')
      .then((res) => setGoogleMap(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadGoogleMap();
  }, []);

  return (
    <>
      <div className="container-fluid px-4 text-center">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <a href="index.html">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">Google Map List</li>
        </ol>

        <div className="card mb-4">
          <div className="card-body">
            <div style={{ overflowX: 'auto' }}>
              <Table striped bordered hover size="sm" className="items-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ width:12 }}>Google Map Link</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {googleMap &&
                    googleMap.map((res) => (
                      <tr>
                        <td>{res.id}</td>
                        <td style={{ width: 20 }}>{res.contents}</td>
                        <td>
                          <Link to={`/googleMap/${res.id}`}>
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
      </div>
      <Modal show={show} onHide={handleClose} style={{ marginTop: '10%' }}>
        <Modal.Header closeButton>
          <Modal.Title>Create Google Map Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GoogleMapForm
            loadGoogleMap={loadGoogleMap}
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
            <strong className="me-auto">Google Map Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
