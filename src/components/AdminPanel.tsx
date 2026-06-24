import React, { useState } from 'react';
import { Product } from '../types';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function AdminPanel({ products, setProducts }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState(() => {
    return localStorage.getItem('autocare_admin_pwd') || 'autocare237';
  });

  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    price: '',
    image: '',
    desc: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      setPwdMsg('Password too short.');
      return;
    }
    setCurrentPassword(newPassword);
    localStorage.setItem('autocare_admin_pwd', newPassword);
    setNewPassword('');
    setPwdMsg('Password updated successfully!');
    setTimeout(() => setPwdMsg(''), 3000);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = editingProduct;
      setProducts(updated);
      setEditingProduct(null);
      setEditIndex(null);
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

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([...products, newProduct]);
    setNewProduct({ name: '', price: '', image: '', desc: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-icon"><i className="fas fa-lock"></i></div>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter admin password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              className="admin-input"
              required 
            />
            {error && <p className="admin-error">{error}</p>}
            <button type="submit" className="btn btn-red w-full justify-center">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-outline" onClick={() => setIsAuthenticated(false)}>Logout</button>
      </div>

      <div className="admin-section">
        <h3>Change Admin Password</h3>
        <form onSubmit={handlePasswordChange} className="admin-pwd-form">
          <input 
            type="text" 
            placeholder="New password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            className="admin-input"
            required 
          />
          <button type="submit" className="btn btn-red">Update</button>
        </form>
        {pwdMsg && <p className="admin-msg">{pwdMsg}</p>}
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
