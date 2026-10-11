import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [reviewState, setReviewState] = useState('idle');

  return (
    <ProductContext.Provider value={{ currentProduct, setCurrentProduct, reviewState, setReviewState }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProduct = () => useContext(ProductContext);
