// src/contexts/AppProviders.jsx

import { OverlayProvider } from './OverlayContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { OrderProvider } from './OrderContext.jsx';
import { ProductProvider } from './ProductContext.jsx';


export const AppProviders = ({ children }) => {
    return (

        <AuthProvider>
            <CartProvider>
                <OrderProvider>
                    <ProductProvider>
                        <OverlayProvider>
                            {children}
                        </OverlayProvider>
                    </ProductProvider>
                </OrderProvider>
            </CartProvider>
        </AuthProvider>

    );
};
