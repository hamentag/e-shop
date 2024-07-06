
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
export default function Checkout({auth, cart, createOrder, setPopUpAuthn}){
    const [nameOnCard, setNameOnCard ] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvc, setCvc] = useState('');

    const [confirmedOrder, setConfirmedOrder] = useState(false);

    const navigate = useNavigate();

    const Confirmation = ()=> {

        return(
            <div className='order-confirmation'>
                <h1>Thank you for your order, {auth.firstname}</h1>
                <button onClick={()=>{navigate('/orders')}}>See Order History</button>
            </div>
        )
    } 

    const submitToPlaceOrder = async(ev) => {
        ev.preventDefault();
        /**
         * Logic to check payment information goes here
         */
        createOrder();
        setConfirmedOrder(true);
    }

    //
    if (!cart) {
        return <section className="loading">Loading..</section>
    }
        
    return(
        <>{
            confirmedOrder?
            <div>
                <Confirmation  />
               
            </div>
            :
            <div>
            {cart.cart_count !== 0 ?
                <div>
                    <div className='order-details'>
                    <h3>Order Details</h3>
                        <table className='order-items'>
                            <tbody>
                                <tr>
                                    <th scope="row">Product </th>
                                    <th scope="row">Status</th>
                                    <th scope="row">Qty</th>
                                    <th scope="row">Price</th>
                                    <th scope="row" style={{ textAlign: 'end', paddingRight: '20px' }}>Subtotal</th>
                                </tr>
                                {
                                    cart.products.map(item => {
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className='cart-item-info'>
                                                        <img src={(item.images.find(image => image.is_showcase)).url} alt="product image" style={{ width: '65px', height: '55px' }} />
                                                        <h4>{item.title}</h4>

                                                    </div>
                                                </td>
                                                <td>Processing</td>
                                                <td>{item.qty}</td>
                                                <td>${item.price}</td>
                                                <td style={{ textAlign: 'end', paddingRight: '20px' }}>${item.cost_per_product}</td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td colSpan={5} >
                                        <hr />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={5}>
                                        <table className='order-total'>
                                            <tbody>
                                                <tr>
                                                    <td>Order Subtotal </td>
                                                    <td>${cart.subtotal}</td>
                                                </tr>
                                                <tr>
                                                    <td>Tax </td>
                                                    <td>${cart.tax}</td>
                                                </tr>
                                                <tr>
                                                    <td>Order Total </td>
                                                    <td style={{ color: 'red' }}>${cart.total}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {
                        auth.id?
                        <div className='payment-info'>
                            <h3>Payment Information</h3>
                            <form onSubmit={ submitToPlaceOrder } className='payment-form'>
                                <input value={ nameOnCard} placeholder='NAME ON CARD' onChange={ ev=> setNameOnCard(ev.target.value)}/>
                                <input value={ cardNumber} placeholder='CARD NUMBER' onChange={ ev=> setCardNumber(ev.target.value)}/>
                                <input value={ expirationDate }  placeholder='MM/YY' onChange={ ev=> setExpirationDate(ev.target.value)}/>
                                <input value={ cvc} placeholder='CVC' onChange={ ev=> setCvc(ev.target.value)}/>
                                <button disabled={ !(nameOnCard && cardNumber && expirationDate && cvc) }>Place Order</button>
                            </form> 
                        </div>
                        :
                        <div style={{width:'fit-content', margin:'0 auto', padding:'1rem'}}>
                            <div>Please log in or register to place your order.</div>
                            <button className='login-btn' onClick={()=>{
                                setPopUpAuthn("to-login")                     
                            }
                      }>Log In
                  </button>  
                        </div>
                    }
                </div>
                :
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button onClick={()=>{navigate('/')}}>Shop Now</button>
                </div>
            }

        </div>
        }
        </>
    )
}