// MenuButton

import NavbarMenu from './NavbarMenu';
import NavAccount from './NavAccount';

import useOverlay from '../hooks/useOverlay';
import NavCart from './NavCart';

export default function MenuButton() {
    const { showOffcanvas } = useOverlay();

    return (
        <button
            className="navbar-toggler flex-shrink-1 px-2"
            type="button"
            onClick={() => {
                showOffcanvas({
                    title: 'Menu',
                    content: <NavbarMenu />,
                    headerButtons: [
                        <NavAccount />,
                        <NavCart />
                    ]
                })
            }}
        >
            <span><i className="bi bi-list fs-3"></i></span>
        </button>
    )
}



