// components/DialogBox.jsx

import { Modal, Button } from 'react-bootstrap';
import useOverlay from '../hooks/useOverlay';

export default function DialogBox() {
  const { msg, setMsg } = useOverlay();

  const handleClose = () => setMsg(null);

  if (!msg) return null;

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Notice</Modal.Title>
      </Modal.Header>
      <Modal.Body>{msg.txt}</Modal.Body>
      <Modal.Footer>
        {msg.more ? msg.more : <Button variant="primary" onClick={handleClose}>OK</Button>}
      </Modal.Footer>
    </Modal>
  );
}
