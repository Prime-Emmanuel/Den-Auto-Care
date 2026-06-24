import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function AdminPanel({ products, setProducts }: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    price: '',
    image: '',
    desc: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };

  const handleResetPassword = async () => {
    const emailToReset = emailInput || window.prompt('Please enter your admin email address to receive a password reset link:');
    if (!emailToReset) {
      setError('An email address is required to reset the password.');
      return;
    }
    try {
      setError('');
      setMsg('');
      await sendPasswordResetEmail(auth, emailToReset);
      setMsg(`Password reset email sent to ${emailToReset}! Check your inbox.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDelete = async (index: number) => {
    const product = products[index];
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        if (product.id) {
          await deleteDoc(doc(db, 'products', product.id));
        }
        const updated = [...products];
        updated.splice(index, 1);
        setProducts(updated);
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editIndex !== null) {
      try {
        if (editingProduct.id) {
          const docRef = doc(db, 'products', editingProduct.id);
          await updateDoc(docRef, {
            name: editingProduct.name,
            price: editingProduct.price,
            image: editingProduct.image,
            desc: editingProduct.desc
          });
        }
        const updated = [...products];
        updated[editIndex] = editingProduct;
        setProducts(updated);
        setEditingProduct(null);
        setEditIndex(null);
      } catch (err) {
        alert('Error updating product');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isEditing && editingProduct) {
          setEditingProduct({ ...editingProduct, image: result });
        } else {
          setNewProduct({ ...newProduct, image: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      const prodWithId = { ...newProduct, id: docRef.id };
      setProducts([...products, prodWithId]);
      setNewProduct({ name: '', price: '', image: '', desc: '' });
    } catch (err) {
      alert('Error adding product');
    }
  };

  if (loadingAuth) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-icon"><i className="fas fa-lock"></i></div>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={emailInput} 
              onChange={e => setEmailInput(e.target.value)} 
              className="admin-input"
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              className="admin-input"
              required 
            />
            {error && <p className="admin-error">{error}</p>}
            {msg && <p className="admin-msg">{msg}</p>}
            <button type="submit" className="btn btn-red w-full justify-center">Login</button>
            <div style={{ marginTop: '16px' }}>
              <button 
                type="button"
                onClick={handleResetPassword}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-section">
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct} className="admin-product-form">
          <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="admin-input" required />
          <input type="text" placeholder="Price (e.g. 5,000 FRS)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="admin-input" required />
          <input type="text" placeholder="Category/Description" value={newProduct.desc} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} className="admin-input" required />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="admin-input" style={{ flex: 1, padding: '10px' }} required={!newProduct.image} />
            {newProduct.image && <img src={newProduct.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
          </div>
          <button type="submit" className="btn btn-red">Add Product</button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Manage Products</h3>
        
        {editingProduct !== null && (
          <div className="admin-edit-modal">
            <div className="admin-edit-box">
              <h3>Edit Product</h3>
              <form onSubmit={handleSaveEdit} className="admin-product-form">
                <input type="text" placeholder="Product Name" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="admin-input" required />
                <input type="text" placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="admin-input" required />
                <input type="text" placeholder="Category/Description" value={editingProduct.desc} onChange={e => setEditingProduct({...editingProduct, desc: e.target.value})} className="admin-input" required />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="admin-input" style={{ flex: 1, padding: '10px' }} />
                  {editingProduct.image && <img src={editingProduct.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-red" style={{flex: 1, justifyContent: 'center'}}>Save</button>
                  <button type="button" className="btn btn-outline" style={{flex: 1, justifyContent: 'center'}} onClick={() => {setEditingProduct(null); setEditIndex(null);}}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-products-list">
          {products.map((p, i) => (
            <div key={i} className="admin-product-item">
              <img src={p.image} alt={p.name} className="admin-p-img" />
              <div className="admin-p-info">
                <strong>{p.name}</strong>
                <span>{p.price} - {p.desc}</span>
              </div>
              <div className="admin-p-actions">
                <button className="btn-icon text-blue" onClick={() => {setEditingProduct(p); setEditIndex(i);}}><i className="fas fa-edit"></i></button>
                <button className="btn-icon text-red" onClick={() => handleDelete(i)}><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
