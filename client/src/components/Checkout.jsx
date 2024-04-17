
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
export default function Checkout({auth, cart, setMsg}){
    const [nameOnCard, setNameOnCard ] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvc, setCvc] = useState('');

    const navigate = useNavigate();

    const submitToPlaceOrder = ev => {
        ev.preventDefault();
        // place order
      }
        
    return(
        <div>
            {cart.length !== 0 ?
                <div>
                    <h3>Oreder Details</h3>
                    <div className='order-details'>
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
                                    cart.map(item => {
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className='cart-item-info'>
                                                        <img src={item.image} alt="product image" style={{ width: '65px', height: '55px' }} />
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
                                                    <td>${cart[0].subtotal}</td>
                                                </tr>
                                                <tr>
                                                    <td>Tax </td>
                                                    <td>${cart[0].tax}</td>
                                                </tr>
                                                <tr>
                                                    <td>Order Total </td>
                                                    <td style={{ color: 'red' }}>${cart[0].total}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h4>Payment Information</h4>
                        <form onSubmit={ submitToPlaceOrder } className='payment-form'>
                            <input value={ nameOnCard} placeholder='NAME ON CARD' onChange={ ev=> setNameOnCard(ev.target.value)}/>
                            <input value={ cardNumber} placeholder='CARD NUMBER' onChange={ ev=> setCardNumber(ev.target.value)}/>
                            <input value={ expirationDate }  placeholder='MM/YY' onChange={ ev=> setExpirationDate(ev.target.value)}/>
                            <input value={ cvc} placeholder='CVC' onChange={ ev=> setCvc(ev.target.value)}/>
                            <button disabled={ !(nameOnCard && cardNumber && expirationDate && cvc) }>Place Order</button>
                        </form> 
                    </div>
                </div>
                :
                <div>
                    <p>Your cart is empty.</p>
                    <button onClick={()=>{navigate('/')}}>Shop Now</button>
                </div>
            }

        </div>
    )
}