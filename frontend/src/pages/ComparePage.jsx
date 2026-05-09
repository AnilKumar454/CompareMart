import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, Truck, ArrowRight, ShieldAlert, Tag } from 'lucide-react';

import { PRODUCTS_DATA } from '../data/products';

export default function ComparePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    // Find product in unified database
    const foundProduct = PRODUCTS_DATA.find(p => p.id === id);
    
    if (foundProduct) {
      // Sort comparisons by price (lowest first)
      const sortedComparisons = [...foundProduct.comparisons].sort((a, b) => a.price - b.price);
      setProduct({ ...foundProduct, comparisons: sortedComparisons });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="main-layout">
        <Navbar />
        <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
          <h2>Product not found</h2>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Go Back</button>
        </div>
      </div>
    );
  }

  const bestPrice = product.comparisons[0];

  return (
    <div className="main-layout">
      <Navbar />
      
      <div className="container" style={{ padding: '40px 0 80px' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: 'none', 
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Product Header Card */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{
            width: '200px', height: '200px', borderRadius: '24px',
            background: '#fff', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ 
                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', 
                mixBlendMode: 'multiply', transition: 'transform 0.3s ease', cursor: 'zoom-in'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} 
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              {product.category}
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
              {product.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px', maxWidth: '600px', lineHeight: 1.5 }}>
              {product.description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>({product.reviews.toLocaleString()} reviews)</span>
              </div>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-color)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '14px', fontWeight: 600 }}>
                <ShieldCheck size={16} /> 100% Authentic
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag size={22} style={{ color: 'var(--brand-primary)' }} /> Price Comparison Across Stores
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {product.comparisons.map((store, index) => {
            const isBestPrice = index === 0 && store.inStock;
            
            return (
              <div 
                key={store.store}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: isBestPrice ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                  background: isBestPrice ? 'rgba(99, 102, 241, 0.03)' : 'var(--bg-secondary)',
                  flexWrap: 'wrap', gap: '20px'
                }}
              >
                {/* Store Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '200px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '12px',
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden', padding: '6px'
                  }}>
                    {store.store === 'Amazon' && <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" style={{ width: '100%' }} />}
                    {store.store === 'Flipkart' && <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Flipkart_logo.svg/300px-Flipkart_logo.svg.png" alt="Flipkart" style={{ width: '100%' }} />}
                    {store.store === 'Nykaa' && <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Nykaa_New_Logo.png" alt="Nykaa" style={{ width: '100%' }} />}
                    {store.store === 'Myntra' && <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png" alt="Myntra" style={{ width: '80%' }} />}
                    {store.store === 'Tata CLiQ' && <img src="https://www.tatacliq.com/favicon.ico" alt="Tata CLiQ" style={{ width: '80%' }} />}
                    {store.store === 'Croma' && <span style={{ fontWeight: 800, color: '#00e2cc' }}>croma</span>}
                    {store.store === 'Pepperfry' && <img src="https://ii1.pepperfry.com/assets/f03c3937-234b-4a81-9b19-c60eb41595ae.png" alt="Pepperfry" style={{ width: '100%' }} />}
                    {store.store === 'Reliance' && <span style={{ fontWeight: 800, color: '#174070' }}>RELIANCE</span>}
                    {store.store === 'Snapdeal' && <span style={{ fontWeight: 800, color: '#e40046' }}>snapdeal</span>}
                    {store.store === 'Nike Official' && <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" style={{ width: '100%' }} />}
                    {store.store === 'Adidas' && <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="Adidas" style={{ width: '100%' }} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {store.store}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: store.inStock ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {store.inStock ? <><ShieldCheck size={14} /> In Stock</> : <><ShieldAlert size={14} /> Out of Stock</>}
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', flex: 1, minWidth: '200px' }}>
                  <Truck size={16} /> {store.delivery}
                </div>

                {/* Price & Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{store.price.toLocaleString('en-IN')}
                    </div>
                    {isBestPrice && (
                      <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                        Best Price
                      </div>
                    )}
                  </div>

                  <a 
                    href={store.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (store.inStock && store.link) {
                        e.preventDefault();
                        window.open(store.link, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    style={{
                      background: store.inStock ? 'var(--gradient-primary)' : 'var(--bg-primary)',
                      color: store.inStock ? '#fff' : 'var(--text-muted)',
                      padding: '12px 24px', borderRadius: '12px',
                      textDecoration: 'none', fontWeight: 700, fontSize: '15px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      pointerEvents: store.inStock ? 'auto' : 'none',
                      opacity: store.inStock ? 1 : 0.6,
                      boxShadow: store.inStock ? '0 4px 12px rgba(99,102,241,0.2)' : 'none',
                      transition: 'transform 0.2s',
                      cursor: store.inStock ? 'pointer' : 'default'
                    }}
                  >
                    Go to Store <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
