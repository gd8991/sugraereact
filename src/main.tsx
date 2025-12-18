import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ProductDetailsPage from './pages/ProductDetailsPage.tsx'
import { CartProvider } from './contexts/CartContext'
import { ProductProvider } from './contexts/ProductContext'
import { RegionProvider } from './contexts/RegionContext'

const basename = import.meta.env.VITE_BASE_PATH || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename={basename}>
      <RegionProvider>
        <ProductProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/product/:productId" element={<ProductDetailsPage />} />
            </Routes>
          </CartProvider>
        </ProductProvider>
      </RegionProvider>
    </Router>
  </StrictMode>,
)
