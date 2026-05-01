import React, { useState, useEffect, useContext, createContext } from 'react';

const API_URL = 'http://localhost:3001/api';

// Auth context
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Main App
export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <div style={styles.app}>
        <Header />
        {!user ? <AuthPage /> : <StorePage />}
      </div>
    </AuthContext.Provider>
  );
}

function Header() {
  const { user, logout } = useAuth();
  return (
    <header style={styles.header}>
      <h1>Shop</h1>
      {user && (
        <div style={styles.headerRight}>
          <span>{user.email}</span>
          <button style={styles.buttonSecondary} onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  );
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error('Auth failed');
      
      const data = await response.json();
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.authPage}>
      <h2>{ isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
        </div>
        <div style={styles.formGroup}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
        </div>
        <button type="submit" style={styles.button}>{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {error && <div style={styles.error}>{error}</div>}
      <button style={{...styles.buttonSecondary, width: '100%', marginTop: '1rem'}} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create account' : 'Login instead'}
      </button>
    </div>
  );
}

function StorePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(new Map());
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      setProducts(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
    const newCart = new Map(cart);
    const current = newCart.get(product.id) || { ...product, quantity: 0 };
    current.quantity += 1;
    newCart.set(product.id, current);
    setCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    const newCart = new Map(cart);
    if (quantity <= 0) {
      newCart.delete(productId);
    } else {
      const item = newCart.get(productId);
      item.quantity = quantity;
    }
    setCart(newCart);
  };

  const checkout = async () => {
    if (cart.size === 0) return;
    setLoading(true);
    
    try {
      const items = Array.from(cart.values()).map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
      
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      setCart(new Map());
      fetchOrders();
      setShowOrders(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = Array.from(cart.values()).reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={styles.page}>
      <div style={styles.navTabs}>
        <button onClick={() => setShowOrders(false)} style={{...styles.button, background: !showOrders ? '#0066cc' : '#999'}}>
          Shop
        </button>
        <button onClick={() => setShowOrders(true)} style={{...styles.button, background: showOrders ? '#0066cc' : '#999'}}>
          Orders ({orders.length})
        </button>
      </div>

      {!showOrders ? (
        <>
          <div style={styles.productsGrid}>
            {products.map(product => (
              <div key={product.id} style={styles.productCard}>
                <h3>{product.name}</h3>
                <p style={styles.price}>${parseFloat(product.price).toFixed(2)}</p>
                <button onClick={() => addToCart(product)} style={styles.button}>Add to Cart</button>
              </div>
            ))}
          </div>

          {cart.size > 0 && (
            <div style={styles.cartSection}>
              <h2>Cart</h2>
              {Array.from(cart.values()).map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <span>{item.name}</span>
                  <div>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      style={{width: '60px', marginRight: '1rem'}}
                    />
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div style={styles.cartFooter}>
                <strong>Total: ${cartTotal.toFixed(2)}</strong>
                <button onClick={checkout} disabled={loading} style={styles.button}>
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map(order => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <strong>Order #{order.id}</strong>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} style={styles.cartItem}>
                    <span>Product {item.product_id}</span>
                    <span>{item.quantity}x ${parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))}
                <div style={styles.orderTotal}>
                  <strong>Total: ${parseFloat(order.total).toFixed(2)}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', background: '#f5f5f5' },
  header: { background: 'white', borderBottom: '1px solid #ddd', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  button: { padding: '0.5rem 1rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  buttonSecondary: { padding: '0.5rem 1rem', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  input: { padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' },
  page: { maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' },
  navTabs: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  productCard: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  price: { fontSize: '1.5rem', fontWeight: 'bold', color: '#0066cc', marginBottom: '1rem' },
  cartSection: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '2rem' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #eee' },
  cartFooter: { marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  authPage: { maxWidth: '400px', margin: '4rem auto', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  formGroup: { marginBottom: '1rem' },
  error: { color: '#d32f2f', marginTop: '1rem', padding: '0.75rem', background: '#ffebee', borderRadius: '4px' },
  orderCard: { background: 'white', padding: '1.5rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' },
  orderTotal: { paddingTop: '1rem', borderTop: '1px solid #eee', marginTop: '1rem', textAlign: 'right' }
};
