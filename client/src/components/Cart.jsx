
import { useNavigate } from "react-router-dom";

export default function Cart({auth, cart, updateCart, setMsg, removeFromCart}){

    const navigate = useNavigate();

    //  
    if (!cart) {
        return <section className="loading">Loading..</section>
      }

    return(
        <>
            {cart.cart_count !== 0 ?
                <div>
                    <div className="cart-header">
                        <h3>Shopping Cart</h3>
                        <div>
                            <div>Subtotal ({cart.cart_count} items): ${cart.subtotal}</div>
                            <button onClick={() => { navigate('/checkout') }}>Proceed to checkout</button>
                        </div>
                    </div>
                    <ul className="cart-list">
                        {cart.products.map(item => {
                            return <li key={item.id} className="cart-item">
                                <div className="cart-item-top">
                                    <h4>{item.title}</h4>
                                    <div>${item.price}/ea</div>
                                </div>
                                <div>
                                    <div className="cart-item-info">
                                        <img src={(item.images.find(image => image.is_showcase)).url} alt="product image" style={{ width: '65px', height: '55px' }} />
                                        <div>
                                            <p>{item.characteristics}.</p>
                                            <div>Dimensions: {item.dimensions} inch</div>
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
                                                    }} className="delete-btn">Delete
                                                    </button>
                                                    :
                                                    <button 
                                                        onClick={async () => {                
                                                        updateCart(item.product_id, item.qty - 1)
                                                        }} 
                                                        disabled={ item.inventory === 0 }
                                                    >-
                                                    </button>
                                            }

                                            <div className="qty"> {item.qty}</div>
                                            <button 
                                                onClick={async () => {
                                                    updateCart(item.product_id, item.qty + 1)
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

