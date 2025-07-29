// src/components/NavCart.jsx



import CartOverview from './CartOverview';

import useOverlay from '../hooks/useOverlay';
import useCart from '../hooks/useCart';


export default function () {
    const { cart } = useCart()
    const { showOffcanvas, hideOffcanvas } = useOverlay();
    



    return (
        < button className="btn flex-shrink-1 position-relative p-0 nav-btn nav-cart"
            onClick={() => {
                showOffcanvas({
                    title: 'Your Cart',
                    content: <CartOverview />,
                })
            }}
        >
            {/* cart-icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-cart2"
                viewBox="0 0 16 16"
            >
                <path
                    d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
                />
            </svg>
            <span className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger">
                {cart? cart.cart_count : ''}
                <span className="visually-hidden">unread messages</span>
            </span>
        </button>
    )
}

