// src/contexts/AppProviders.jsx

import { OverlayProvider } from './OverlayContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { OrderProvider } from './OrderContext.jsx';
import { ProductProvider } from './ProductContext.jsx';


export const AppProviders = ({ children }) => {
    return (
        <OverlayProvider>
            <AuthProvider>
                <CartProvider>
                    <OrderProvider>
                        <ProductProvider>
                            {children}
                        </ProductProvider>
                    </OrderProvider>
                </CartProvider>
            </AuthProvider>
        </OverlayProvider>
    );
};
