// src/contexts/OverlayContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';

import { useLocation } from 'react-router-dom';

import NavAccount from '../components/NavAccount';


export const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [msg, setMsg] = useState(null);
  const [popUpAuthn, setPopUpAuthn] = useState(null); // 'to-login', 'to-register'

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalProps, setModalProps] = useState({});

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
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ title = 'Notice', message, time = 'just now', duration = 5000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, title, message, time }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  // Action Toast
  const [actionToast, setActionToast] = useState({
    show: false,
    message: '',
    actionBtn: null,
  });

  const actionToastRef = useRef(null);

  const showActionToast = useCallback((message, actionBtn = null) => {
    setActionToast({ show: true, message, actionBtn });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setActionToast((prev) => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  useEffect(() => {
    if (actionToast.show && actionToastRef.current) {
      const bsToast = new window.bootstrap.Toast(actionToastRef.current, {
        autohide: true,
        delay: 5000,
      });
      bsToast.show();
    }
  }, [actionToast.show]);


  
  // Offcanvas
  const [offcanvasContent, setOffcanvasContent] = useState(null);
  const [offcanvasTitle, setOffcanvasTitle] = useState('');
  const offcanvasRef = useRef(null);

  const showOffcanvas = useCallback(({ title = '', content }) => {
    setOffcanvasTitle(title);
    setOffcanvasContent(content);

    setTimeout(() => {
      const el = offcanvasRef.current;
      if (el) {
        const instance = window.bootstrap.Offcanvas.getOrCreateInstance(el);
        instance.show();
      }
    }, 0);
  }, []);

  const hideOffcanvas = useCallback(() => {
    const el = offcanvasRef.current;
    if (el) {
      const instance = window.bootstrap.Offcanvas.getInstance(el);
      if (instance) instance.hide();
    }
  }, []);


    

  //
  const location = useLocation();
  const [searchParam, setSearchParam] = useState("");

  useEffect(() => {
    if (!searchParam.trim()) {
      hideOffcanvas();
    }
  }, [location.pathname]);




  return (
    <OverlayContext.Provider
      value={{
        msg,
        setMsg,
        popUpAuthn,
        setPopUpAuthn,
        openModal,
        closeModal,
        showToast,
        showActionToast, 
        showOffcanvas,
        hideOffcanvas,
      }}
    >
      {children}

      {/* Modal Rendering */}
      <Modal
        show={modalVisible}
        onHide={closeModal}
        onExited={() => {
          setModalContent(null);
          setModalTitle(null);
          setModalProps({});
        }}
        centered
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

      {/* Standard Toasts */}
      {createPortal(
        <div
          className="toast-container position-fixed bottom-0 start-0 p-5"
          style={{ zIndex: 1055 }}
        >
          {toasts.map(({ id, title, message, time }) => (
            <div
              key={id}
              className="toast fade show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-header">
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                <strong className="me-auto">{title}</strong>
                <small className="text-body-secondary">{time}</small>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== id))
                  }
                ></button>
              </div>
              <div className="toast-body">{message}</div>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* Action Toast */}
      <div
        className="position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1055 }}
      >
        <div
          ref={actionToastRef}
          className={`toast ${actionToast.show ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header py-0">
            <div className="me-auto">E-Shop</div>
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>

          {actionToast.message && (
            <div className="toast-body">{actionToast.message}</div>
          )}

          {actionToast.actionBtn && (
            <div className="p-1">{actionToast.actionBtn}</div>
          )}
        </div>
      </div>

      {/* Global Offcanvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-fullscreen-sm-down"
        // style={{width: "25%"}}
        tabIndex="-1"
        id="globalOffcanvas"
        aria-labelledby="globalOffcanvasLabel"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="globalOffcanvasLabel">
            {offcanvasTitle}
          </h5>

          <NavAccount />
          
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">{offcanvasContent}</div>
      </div>

    </OverlayContext.Provider>
  );
};

export default function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context)
    throw new Error('useOverlay must be used within a OverlayProvider');
  return context;
}
