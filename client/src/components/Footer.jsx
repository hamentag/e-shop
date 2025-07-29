// src/components/Footer.jsx

import { useNavigate, Link } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="footer pt-4 mt-auto">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h6>Contact</h6>
                        <ul className="list-unstyled">
                            <li><span><i className="bi bi-geo-alt-fill"></i></span>{' Nashville, TN 37211, US'} </li>
                            <li>
                                <a href="mailto:hamentag1@gmail.com">
                                    <span><i className="bi bi-envelope-fill"></i></span>{' hamentag1@gmail.com'}
                                </a>
                            </li>
                            <li >
                                <a href="tel:+16155968769">
                                    <span><i className="bi bi-telephone-fill"></i></span>{" +1 (615) 596-8769"}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6>Links</h6>
                        <ul className="list-unstyled">
                            <li>
                                <a href="https://github.com/hamentag/e-shop">
                                    <span><i className="bi bi-globe"></i></span>{" eshop.amentag.com"}
                                </a>
                            </li>
                            <li>
                                <a href="www.eshop.amentag.com">
                                    <span><i className="bi bi-question-circle-fill"></i></span>{" FAQ"}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6>Follow</h6>
                        <ul className="list-unstyled follow">
                            <li>
                                <a href="https://www.linkedin.com/in/hamza-amentag/" target="_blank">
                                    <span><i className="bi bi-linkedin"></i></span>
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/hamentag1" target="_blank" >
                                    <span><i className="bi bi-twitter-x"></i></span>
                                </a>

                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/hamza-amentag/" target="_blank" >
                                    <span><i className="bi bi-facebook"></i></span>
                                </a>

                            </li>
                        </ul>

                    </div>
                </div>

                <hr className="border-light" />
                <div className="text-center mt-auto">
                    <p className="mb-0">
                        &copy; {new Date().getFullYear()} E-Shop |{" "}
                        <Link to="/privacy" className="text-decoration-none">
                            Privacy Policy
                        </Link>
                    </p>
                </div>

            </div>
        </footer>
    )
}

