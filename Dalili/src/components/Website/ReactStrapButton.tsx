import React, { useState } from "react";
import { Alert, Button } from "reactstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const ReactStrapButton = () => {
  const [isOpen, setOpen] = useState(true);
  return (
    <>
      <div> Welcome to React Strap</div>
      <Button color="danger" />

      {/* <Modal isOpen={open} toggle={() => setOpen(false)}>
        <ModalHeader>Modal title</ModalHeader>
        <ModalBody>Modal body text goes here.</ModalBody>
      </Modal> */}

      <Alert color="">Hey! Pay attention.</Alert>
    </>
  );
};

export default ReactStrapButton;
