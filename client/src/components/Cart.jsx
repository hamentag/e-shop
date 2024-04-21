
import { useNavigate } from "react-router-dom";

export default function Cart({auth, cart, updateCart, setMsg, removeFromCart}){

    const navigate = useNavigate();

    //  
    return(
        <>
            {cart.length !== 0 ?
                <div>
                    <div className="cart-header">
                        <h3>Shopping Cart</h3>
                        <div>
                            <div>Subtotal ({cart[0].cart_count} items): ${cart[0].subtotal}</div>
                            <button onClick={() => { navigate('/checkout') }}>Proceed to checkout</button>
                        </div>
                    </div>
                    <ul className={auth.id? "cart-list-logged-in" : "cart-list-logged-out"}>
                        {cart.map(item => {
                            return <li key={item.id} className="cart-item">
                                <div className="cart-item-top">
                                    <h4>{item.title}</h4>
                                    <div>${item.price}/ea</div>
                                </div>
                                <div>
                                    <div className="cart-item-info">
                                        <img src={item.image} alt="product image" style={{ width: '65px', height: '55px' }} />
                                        <div>
                                            <p>{item.characteristics}.</p>
                                            <div>{item.dimensions}</div>
                                            <div>{item.inventory > 0 ?
                                                item.inventory <= 5 ?
                                                    <div style={{ color: "red" }}>Only {item.inventory} left</div>
                                                    : <div>In Stock</div>
                                                : <p>Out of Stock</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cart-item-edit">
                                        <div className="edit-qty">
                                            {
                                                item.qty === 1 ?
                                                    <button onClick={() => {
                                                        setMsg({
                                                            txt: `Are you sure you want to delete "${item.title}" from your cart?`,
                                                            more: <button onClick={() => { removeFromCart(item.product_id); setMsg(null) }}>Yes</button>
                                                        });
                                                    }} className="delete-btn">Remove
                                                    </button>
                                                    :
                                                    <button 
                                                        onClick={async () => {                
                                                        updateCart(item.id, item.qty - 1)
                                                        }} 
                                                        disabled={ item.inventory === 0 }
                                                    >-
                                                    </button>
                                            }

                                            <div className="qty"> {item.qty}</div>
                                            <button 
                                                onClick={async () => {
                                                    updateCart(item.id, item.qty + 1)
                                                }}
                                                disabled={ item.inventory === 0 }
                                            >+</button>
                                        </div>
                                        <button onClick={() => {
                                            setMsg({
                                                txt: `Are you sure you want to delete "${item.title}" from your cart?`,
                                                more: <button onClick={() => { removeFromCart(item.product_id); setMsg(null) }}>Yes</button>
                                            });
                                        }} className="delete-btn">Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        })
                        }
                    </ul>
                </div>
                :
                <div className="empty-cart">
                     <p>Your cart is empty.</p>
                    <button onClick={()=>{navigate('/')}}>Shop Now</button>
                </div>
            }
        </>
    )
}

