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
import { useLocation, Link } from 'react-router-dom';

// import NavAccount from '../components/NavAccount';
// import NavCart from '../components/NavCart';
// import MenuButton from '../components/MenuButton';


export const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [msg, setMsg] = useState(null);
  const [popUpAuthn, setPopUpAuthn] = useState(null);

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

  const showActionToast = useCallback((message, actionBtn = null, persist = false) => {
    setActionToast({ show: true, message, actionBtn, persist });

    // Auto-dismiss after 5 seconds unless presist set to true
     if (!persist) {
      setTimeout(() => {
        setActionToast((prev) => ({ ...prev, show: false }));
      }, 5000);
     }
    
  }, []);

  const closeActionToast = useCallback(() => {
    if (actionToastRef.current) {
      const bsToast = window.bootstrap.Toast.getInstance(actionToastRef.current);
      if (bsToast) {
        bsToast.hide();
      }
    }
    setActionToast((prev) => ({ ...prev, show: false }));
  }, []);


  useEffect(() => {
    if (actionToast.show && actionToastRef.current) {
      const bsToast = new window.bootstrap.Toast(actionToastRef.current, {
        autohide: !actionToast.persist,
        delay: 5000,
      });
      bsToast.show();
    }
  }, [actionToast.show, actionToast.persist]);

  
  // Global Offcanvas
  const [offcanvasContent, setOffcanvasContent] = useState(null);
  const [offcanvasTitle, setOffcanvasTitle] = useState('');
  // const [offcanvasHeaderBtnOne, setOffcanvasHeaderBtnOne] = useState(null);
  // const [offcanvasHeaderBtnTwo, setOffcanvasHeaderBtnTwo] = useState(null);
  const [offcanvasHeaderButtons, setOffcanvasHeaderButtons] = useState([]);

  const offcanvasRef = useRef(null);

  const showOffcanvas = useCallback(({ title = '', headerButtons = [], content }) => {
    setOffcanvasTitle(title);
    setOffcanvasContent(content);
    setOffcanvasHeaderButtons(headerButtons);

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
        closeActionToast, 
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
        className="position-fixed top-0 start-50 translate-middle-x p-2"
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
            <strong className="me-auto">E-Shop</strong>
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>

          {actionToast.message && (
            <div className="toast-body"><strong>{actionToast.message}</strong></div>
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
        // data-bs-scroll="true"?
        // data-bs-backdrop="false"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h4 className="offcanvas-title" id="globalOffcanvasLabel">
            {offcanvasTitle}
          </h4>

          {/* <NavAccount /> */}
          {/* {offcanvasHeaderBtnOne} */}

          {/* {offcanvasTitle === 'Menu' ? <NavCart /> : <MenuButton style={{color: 'red'}}/>} */}

          {offcanvasHeaderButtons?.map((btn, idx) =>
            React.isValidElement(btn)
              ? React.cloneElement(btn, { key: idx })
              : null
          )}

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body pt-0 overflow-auto flex-grow-1">{offcanvasContent}</div>
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
