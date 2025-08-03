// src/components/SingleProduct.jsx

const baseURL = ''

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useProduct from '../hooks/useProduct';

import CartQtyCtrl from '../components/CartQtyCtrl';
import StarRating from "./StarRating";


export default function SingleProduct() {

    const { setMsg } = useOverlay();
    const { auth } = useAuth();
    const { cart, addToCart } = useCart();
    const { deleteProduct } = useProduct();

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [displayedImage, setDisplayedImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [crtPrd, setCrtPrd] = useState(null);

    console.log("full sngl product >>> ", product)

    useEffect(() => {
        const fetchSingleProduct = async () => {
            const response = await fetch(`${baseURL}/api/products/${id}`);
            const json = await response.json();
            if (response.ok) {
                setProduct(json);
                setDisplayedImage(json.images.find(image => image.is_showcase))
            }
            else {
                console.error(response.error);
                setError(response.error)
            }
        };
        fetchSingleProduct();
    }, [id, cart]);

    //   useEffect(() => { 

    //         if(cart && product){                             
    //             for (let i = 0; i < cart.products.length; i++) {                   
    //                 if (cart.products[i].product_id === product.id) {
    //                     setCrtPrd(cart.products[i])
    //                     break;
    //                 }
    //                 setCrtPrd(null)
    //             }            
    //         }

    //   }, [cart, product])
    useEffect(() => {
        if (cart && product) {
            const match = cart.products.find(p => p.product_id === product.id);
            setCrtPrd(match || null); // If found, set it. If not, null.
        }
    }, [cart, product]);



    return (
        <>
            {!error && product && (
                <div className="container py-4">
                    <h3 className="mb-2">{product.title}</h3>
                    <StarRating rating={product.average_rating} count={product.review_count} />

                    <div className="row mt-4">
                        {/* Left side: Images */}
                        <div className="col-md-6 mb-4">
                            <div className="mb-3 text-center">
                                <img
                                    src={displayedImage?.url}
                                    alt="Main"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '320px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                                {product.images.map((image) => (
                                    <img
                                        key={image.title}
                                        src={image.url}
                                        alt="thumbnail"
                                        className="img-thumbnail"
                                        style={{ width: '60px', height: '60px', cursor: 'pointer', objectFit: 'cover' }}
                                        onMouseOver={() => setDisplayedImage(image)}
                                        onClick={() => setDisplayedImage(image)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right side: Info + Action */}
                        <div className="col-md-6">
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">
                                    <strong>Category:</strong> {product.category}
                                </li>
                                <li className="list-group-item">
                                    <strong>Brand:</strong> {product.brand}
                                </li>
                                <li className="list-group-item">
                                    <strong>Price:</strong> ${product.price}
                                </li>
                                <li className="list-group-item">
                                    <strong>Dimensions:</strong> {product.dimensions}
                                </li>
                                <li className="list-group-item">
                                    <strong>Characteristics:</strong> {product.characteristics}
                                </li>
                                {auth.is_admin && (
                                    <li className="list-group-item">
                                        <strong>Inventory:</strong> {product.inventory}
                                    </li>
                                )}
                            </ul>

                            {/* Inventory status */}
                            {product.inventory === 0 && (
                                <div className="alert alert-warning p-2 text-center">Out of Stock</div>
                            )}

                            {/* Add to cart or QtyCtrl */}
                            <div className="w-50 mx-auto">
                                {crtPrd ? (
                                    <CartQtyCtrl item={crtPrd} />
                                ) : (
                                    <button
                                        className="btn act-btn w-100"
                                      
                                        onClick={() => addToCart(product.id, 1)}
                                        disabled={product.inventory === 0}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-5">
                        <h5>Customer Reviews</h5>
                        {product.reviews?.length > 0 ? (
                            product.reviews.map((review) => (
                                <div key={review.id} className="border-bottom pb-3 mb-3">
                                    <strong>
                                        {review.user.firstname} {review.user.lastname}
                                    </strong>
                                    <div className="my-1">
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="text-muted small mb-1">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                    <p>{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No reviews yet for this product.</p>
                        )}
                    </div>
                </div>
            )}
        </>

    )
}

