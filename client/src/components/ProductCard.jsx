// src/components/ProductCard.jsx

import { useNavigate } from "react-router-dom";
import CartQtyCtrl from "./CartQtyCtrl";
import StarRating from "./StarRating";

import useCart from "../hooks/useCart";
// import useProduct from "../hooks/useProduct";

export default function ProductCard({ product }) {
    const { cart, addToCart} = useCart();
  const navigate = useNavigate();

  const crtItem = cart?.products.find((item) => item.product_id === product.id);
  const showcaseImg = product.images.find((image) => image.is_showcase);

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  return (
    <div className="card product-card h-100" >
      <img
        src={showcaseImg?.url}
        alt="product image"
        className="img-fluid object-fit-contain bd-placeholder-img card-img-top product-img mx-auto"
        onClick={() => navigate(`/${product.id}`)}
        role="button"      
      />

      <div className="card-body py-0">
        <h5 className="card-title my-0" onClick={() => navigate(`/${product.id}`)}>{product.title}</h5>
        <StarRating rating={product.average_rating} count={product.review_count} />
        <small className="card-text">
          {truncateText(product.characteristics, 96 - product.title.length)}
        </small>

        <div className="product-price" onClick={() => navigate(`/${product.id}`)}>
          ${Number(product.price).toFixed(2)}
        </div>

        <div>
          {product.inventory > 0 ? (
            product.inventory <= 5 ? (
              <small style={{ color: "red" }}>Only {product.inventory} left</small>
            ) : (
              <small>In Stock</small>
            )
          ) : (
            <small style={{ color: "red" }}>Out of Stock</small>
          )}
        </div>
      </div>

      <div className="card-footer px-2 border-0">
        {crtItem ? (
          <CartQtyCtrl item={crtItem} />
        ) : (
          <button
             className="qty-control d-flex justify-content-center align-items-center rounded-pill py-1 px-0 px-md-1 px-lg-2 w-100"
            onClick={() => addToCart(product.id, 1)}
            disabled={product.inventory === 0}
          >
            {/* Add to cart */}
            <strong className="d-flex align-text-center">Add to cart</strong>
          </button>
        )}
      </div>
    </div>
  );
}
