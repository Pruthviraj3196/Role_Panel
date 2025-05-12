import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
} from '../redux/productSlice';
import { fetchOrders, placeOrder, updateOrderStatus } from '../redux/orderSlice';
import { fetchUsers, assignRole } from '../redux/userSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);
  const users = useSelector((state) => state.users);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // New state for placing orders
  const [customerName, setCustomerName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    if (user?.role === 'Admin') dispatch(fetchUsers());
  }, [dispatch, user]);

  const handleRoleChange = (id, newRole) => {
    dispatch(assignRole({ id, role: newRole }));
  };

  const handleProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
      })
    ).then(() => {
      setNewProduct({ name: '', price: '', description: '' });
      dispatch(fetchProducts());
    });
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditValues({
      name: product.name,
      price: product.price,
      description: product.description,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = (id) => {
    dispatch(updateProduct({ id, updates: editValues })).then(() => {
      setEditingId(null);
      setEditValues({});
      dispatch(fetchProducts());
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!customerName || !selectedProductId) return;
    dispatch(placeOrder({ customerName, productId: selectedProductId })).then(() => {
      setCustomerName('');
      setSelectedProductId('');
      dispatch(fetchOrders());
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard ({user.role})</h1>

      {(user.role === 'Admin' || user.role === 'Manager') && (
        <>
          {/* Product creation form */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
            <form onSubmit={handleProductSubmit} className="space-y-2 max-w-md">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleProductChange}
                className="w-full border p-2"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleProductChange}
                className="w-full border p-2"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleProductChange}
                className="w-full border p-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Create Product
              </button>
            </form>
          </div>

          {/* Product list with edit only */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">All Products</h2>
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Price</th>
                  <th className="border px-2 py-1">Description</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td className="border px-2 py-1">
                      {editingId === p._id ? (
                        <input
                          name="name"
                          value={editValues.name}
                          onChange={handleEditChange}
                          className="border p-1 w-full"
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {editingId === p._id ? (
                        <input
                          name="price"
                          type="number"
                          value={editValues.price}
                          onChange={handleEditChange}
                          className="border p-1 w-full"
                        />
                      ) : (
                        `$${p.price}`
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {editingId === p._id ? (
                        <input
                          name="description"
                          value={editValues.description}
                          onChange={handleEditChange}
                          className="border p-1 w-full"
                        />
                      ) : (
                        p.description
                      )}
                    </td>
                    <td className="border px-2 py-1 space-x-1">
                      {editingId === p._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(p._id)}
                            className="bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(p)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Products and Place Order form for Employees */}
      {user.role === 'Employee' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Available Products</h2>
            <ul>
              {products.map((p) => (
                <li key={p._id}>
                  {p.name} - ${p.price}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Place an Order</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-2 max-w-md">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full border p-2"
              />
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full border p-2"
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - ${p.price}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Place Order
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Your Orders</h2>
            <ul>
              {orders.map((o) => (
                <li key={o._id}>
                  {o.customerName} - {o.product?.name} - {o.status}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Orders for Admin/Manager */}
      {user.role !== 'Employee' && (
  <div className="mt-4">
    <h2 className="text-xl mb-2">Orders</h2>
    <table className="min-w-full border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Customer</th>
          <th className="border px-2 py-1">Product</th>
          <th className="border px-2 py-1">Status</th>
          {user.role === 'Manager' && <th className="border px-2 py-1">Update Status</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o._id}>
            <td className="border px-2 py-1">{o.customerName}</td>
            <td className="border px-2 py-1">{o.product?.name}</td>
            <td className="border px-2 py-1">{o.status}</td>
            {user.role === 'Manager' && (
              <td className="border px-2 py-1">
                <select
                  value={o.status}
                  onChange={(e) =>
                    dispatch(updateOrderStatus({ id: o._id, status: e.target.value })).then(() =>
                      dispatch(fetchOrders())
                    )
                  }
                  className="border p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {/* User management for Admin */}
      {user.role === 'Admin' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">All Users</h2>
          <table className="min-w-full mt-2 border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="border px-2 py-1">{u.name}</td>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1">{u.role}</td>
                  <td className="border px-2 py-1">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border p-1"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


