// src/components/Orders.jsx

import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import useOrders from '../hooks/useOrders';



export default function Orders() {

    const { auth } = useAuth();
    const { orders } = useOrders(); 
     
    const navigate = useNavigate();


    return (
        <>{
            auth.id && <div className="py-3">{
                orders.length !== 0? 
                <ul className="orders-container"> {
                    orders.map(orderCollection => {
                        return (
                            <li key={orderCollection.order_collection_id} className="order-collection">
    
                                <div className="order-item-top">
                                    <h4>{new Date(orderCollection.created_at).toLocaleString()}</h4>
                                    <div>${orderCollection.total}</div>
                                </div>
                                <ul className="order-batch-container">{
                                    orderCollection.items.map(item => {
                                        return (
                                            <li key={item.product_id} className="order">
                                                <div className="order-item">
                                                    <div>{item.title}</div>
                                                    <div>QTY: {item.qty}</div>
                                                    <img src={item.url} alt="product image" style={{ width: '85px', height: '78px' }} />
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                                </ul>
                            </li>
                        )
                    })
                }
                </ul>
                :
                <div className='empty-order-history'>
                    Your order history is empty.
                    <button onClick={()=>{navigate('/')}}>Shop Now</button>
                    OR
                    <button onClick={()=>{navigate('/cart')}}>See Cart</button>
                </div>
                }
                
            </div>
        }
        </>
    )
}
    