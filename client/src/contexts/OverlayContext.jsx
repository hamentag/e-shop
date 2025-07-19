// src/contexts/OverlayContext

import { createContext, useContext, useState, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';

export const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [msg, setMsg] = useState(null);
  const [popUpAuthn, setPopUpAuthn] = useState(null); // 'to-login', 'to-register'

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const [toasts, setToasts] = useState([]);


  const openModal = useCallback((content, options = {}) => {
    setModalContent(content);
    setModalTitle(options.title || null);
    setModalProps(options.props || {});
    setModalVisible(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);


  // Toast
  const showToast = useCallback(({ title = 'Notice', message, time = 'just now', duration = 5000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, time }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);


  //


  return (
    <OverlayContext.Provider value={{ msg, setMsg, popUpAuthn, setPopUpAuthn, openModal, closeModal,showToast }}>
      {children}

      <Modal
        show={modalVisible}
        onHide={closeModal}
        onExited={() => {
          setModalContent(null);
          setModalTitle(null);
          setModalProps({});
        }}
        centered
        // backdrop="static"
        {...modalProps}
      >
        {modalTitle && (
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer className="justify-content-start">
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      

      {/* Toast rendering */}
      {createPortal(
        <div className="toast-container position-fixed bottom-0 start-0 p-5" style={{ zIndex: 1055 }}>
          {toasts.map(({ id, title, message, time }) => (
            <div key={id} className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="toast-header">
                {/* <svg className="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#007aff" />
                </svg> */}
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                <strong className="me-auto">{title}</strong>
                <small className="text-body-secondary">{time}</small>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== id))}
                ></button>
              </div>
              <div className="toast-body">{message}</div>
            </div>
          ))}
        </div>,
        document.body
      )}

    </OverlayContext.Provider>
  );
};

export default function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useOverlay must be used within a OverlayProvider");
  return context;
}
