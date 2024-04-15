
import { Link, useNavigate } from "react-router-dom";

export default function Cart({auth, products, cart, removeFromCart,cartCount, 
    setCartCount}){

    const navigate = useNavigate();

    // update cart
    const updateCart = async(product_id, qty)=> {
        const response = await fetch(`/api/users/${auth.id}/cart`, {
          method: 'PUT',
          body: JSON.stringify({ product_id, qty}),
          headers: {
            'Content-Type': 'application/json',
            authorization: window.localStorage.getItem('token')
          }
        });
        return response
      };


    //  
    return(
        <>
            {auth.id &&
                <>
                    {cart.length !== 0 ?
                        <div>
                            <div className="cart-header">
                                <h3>Shooping Cart</h3>
                                <div>
                                    <div>Subtotal ({cartCount} items): ${cart[0].subtotal}</div>
                                    <button onClick={() => { navigate('/checkout') }}>Proceed to checkout</button>
                                </div>
                            </div>
                            <ul className="cart-list">
                                {cart.map(item => {
                                    const myProduct = products.find(product => product.id === item.product_id);

                                    return <li key={item.id} className="cart-item">
                                        <div className="cart-item-top">
                                            <h4>{myProduct.title}</h4>
                                            <div>${myProduct.price}/ea</div>
                                        </div>
                                        <div>
                                            <div className="cart-item-info">
                                                <img src={item.image} alt="product image" style={{ width: '65px', height: '55px' }} />
                                                <div>
                                                    <p>{myProduct.characteristics}.</p>
                                                    <div>{myProduct.dimensions}</div>
                                                    <div>{myProduct.inventory > 0 ?
                                                        myProduct.inventory <= 5 ?
                                                            <div style={{ color: "red" }}>Only {myProduct.inventory} left</div>
                                                            : <div>In Stock</div>
                                                        : <p>Out of Stock</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cart-item-edit">
                                                <div className="edit-qty">
                                                    {
                                                        item.qty === 1 ?
                                                            <button onClick={() => { removeFromCart(item.product_id) }} className="delete-btn">Remove
                                                            </button>
                                                            :
                                                            <button onClick={async () => {
                                                                const response = await updateCart(myProduct.id, item.qty - 1)
                                                                const json = await response.json();
                                                                if (response.ok) {
                                                                    item.qty = json.qty;
                                                                    setCartCount((n) => --n)
                                                                }
                                                            }}>-
                                                            </button>
                                                    }

                                                    {item.qty}

                                                    <button onClick={async () => {
                                                        const response = await updateCart(myProduct.id, item.qty + 1)
                                                        const json = await response.json();
                                                        if (response.ok) {
                                                            item.qty = json.qty;
                                                            setCartCount((n) => ++n)
                                                        }
                                                        else {
                                                           console.error(json.error)
                                                        }
                                                    }}>+</button>
                                                </div>
                                                <button onClick={() => { removeFromCart(item.product_id) }} className="delete-btn">Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                })
                                }
                            </ul>
                        </div>
                        :
                        <div>Your cart is empty.</div>
                    }
                </>

            }
        </>
    )
}