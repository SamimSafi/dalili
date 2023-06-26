import React, { useEffect, useState } from 'react'
import { Button, ToastContainer } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from '../../Constaints/baseUrl';
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';
import { IconPickerItem } from 'react-fa-icon-picker'

type contactUs=[{
    id:number;
    customerName:string;
    customerEmail:string;
    customerMessage:string;
}];
export const ContactUsList = () => {
    const [show, setShow] = useState(false);
    const handleClose = () =>{ setShow(false)}
    const handleShow = () => setShow(true);
    const [contactUs, setContactUs] = useState<contactUs>();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const deleteSocial = (id) => {
        axios
          .delete(baseUrl + '/contactUs/' + id)
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            loadSocial();
          });
      };
      const loadSocial = () => {

        axios
          .get(baseUrl + '/contactUs')
          .then((res) => setContactUs(res.data))
          .catch((err) => console.log(err));
      };
      useEffect(() => {
        loadSocial();
      }, []);
    
  return (
    <>
      <div className="container-fluid px-4 text-center" >
                        <ol className="breadcrumb mb-4">
                            <li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                            <li className="breadcrumb-item active">Contactus List</li>
                        </ol>
                        <div className='text-end'>

                        {/* <Button variant="primary" className='mb-2 position' onClick={handleShow}>
        Create New
      </Button> */}
                        </div>
                        <div className="card mb-4">
                            <div className="card-body">
                            <Table striped bordered hover size="sm" className='items-center'>
      <thead> 
        <tr>
          <th>#</th>
          <th>Customer Name</th>
          <th>Customer Email</th>
          <th>Customer Message</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {contactUs && contactUs.map((res)=>(
 <tr>
 <td>{res.id}</td>
 <td>
                    {<IconPickerItem icon={res.customerName} size={24} color="#000" />}

                    </td>
 <td>{res.customerEmail}</td>
 <td>{res.customerName}</td>
 <td>
  {/* <Link to={`/socialIcon/${res.id}`}> <Button variant="warning">Edit</Button></Link>{' '} */}
      <Button variant="danger" onClick={()=>deleteSocial(res.id)}>Delete</Button>{' '}</td>
</tr>
        ))}
       
      </tbody>
    </Table>
                            </div>
                        </div>
                     
                    </div>
                    <Modal show={show} onHide={handleClose} style={{marginTop: "10%"}}>
        <Modal.Header closeButton>
          <Modal.Title>Create Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          {/* <SocialForm loadSocial={loadSocial} setShow={setShow} setShowToast={setShowToast} setToastMessage={setToastMessage}/> */}
        </Modal.Body>
        <Modal.Footer  >
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-end" className="p-3">
      <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Social Form</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
        </ToastContainer>
    </>
  )
}
