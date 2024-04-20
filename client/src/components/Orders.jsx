import { useNavigate } from 'react-router-dom';
export default function Orders({ auth, orders }) {

    const navigate = useNavigate();
    return (
        <>{
            auth.id && <div>{
                orders.length !== 0? 
                <ul className="orders-container"> {
                    orders.map((orderBatch, index) => {
                        return (
                            <li key={index} className="orderbatch">
    
                                <div className="order-item-top">
                                    <h4>{new Date(orderBatch[0].created_at).toLocaleString()}</h4>
                                    <div>${orderBatch[0].total}</div>
                                </div>
                                <ul className="order-batch-container">{
                                    orderBatch.map(order => {
                                        return (
                                            <li key={order.id} className="order">
                                                <div className="order-item">
                                                    <div>{order.title}</div>
                                                    <div>QTY: {order.qty}</div>
                                                    <img src={order.image} alt="product image" style={{ width: '85px', height: '78px' }} />
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
                    Your history is empty.
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
    