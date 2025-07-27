// src/contexts/AppProviders.jsx

import { OverlayProvider } from './OverlayContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { OrderProvider } from './OrderContext.jsx';
import { ProductProvider } from './ProductContext.jsx';
import { BrandsProvider } from './BrandsContext.jsx';
import { CategoryProvider } from './CategoryContext.jsx';

export const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>
                <OrderProvider>
                    <BrandsProvider>
                        <ProductProvider>
                            <CategoryProvider>
                                <OverlayProvider>
                                    {children}
                                </OverlayProvider>
                            </CategoryProvider>
                        </ProductProvider>
                    </BrandsProvider>
                </OrderProvider>
            </CartProvider>
        </AuthProvider>
    );
};
