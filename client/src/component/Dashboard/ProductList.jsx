import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, fetchProducts } from '../../redux/productSlice';

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditValues({ name: product.name, price: product.price, description: product.description });
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

  const handleChange = (e) => setEditValues({ ...editValues, [e.target.name]: e.target.value });

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Price</th>
              <th className="px-4 py-3 border">Description</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {products.map((p, index) => (
              <tr
                key={p._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition'}
              >
                <td className="px-4 py-2 border">
                  {editingId === p._id ? (
                    <input
                      name="name"
                      value={editValues.name}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editValues.price}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    `$${p.price}`
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editingId === p._id ? (
                    <input
                      name="description"
                      value={editValues.description}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    p.description || <span className="italic text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  {editingId === p._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(p._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(p)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
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
    </div>
  );
}
