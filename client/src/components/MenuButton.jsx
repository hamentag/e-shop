// MenuButton

import NavbarMenu from '../components/NavbarMenu';

import useOverlay from '../hooks/useOverlay';

export default function MenuButton() {
    const { showOffcanvas } = useOverlay();

    return (
        <button
                className="navbar-toggler flex-shrink-1 p-0"
                type="button"
                // data-bs-toggle="offcanvas"
                // data-bs-target="#offcanvasNavbar"
                // aria-controls="offcanvasNavbar"
                // aria-label="Toggle navigation"

                onClick={() => {
                    showOffcanvas({
                        title: 'Menu',
                        content: <NavbarMenu />,
                                    })
                                }}
            >
                <span><i className="bi bi-list fs-4"></i></span>
        </button>
    )
}



