import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder, fetchOrders } from '../../redux/orderSlice';

export default function OrderForm() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);

  const [customerName, setCustomerName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  const openOrderModal = (productId = '') => {
    setSelectedProductId(productId);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    dispatch(placeOrder({ customerName, productId: selectedProductId })).then(() => {
      setCustomerName('');
      setSelectedProductId('');
      setIsOrderModalOpen(false);
      dispatch(fetchOrders());
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow space-y-12">
      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Products</h2>
          <button
            onClick={() => setIsOrdersModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            View Your Orders
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
              <p className="text-gray-500 mt-1">High-quality and best in class.</p>
              <p className="text-green-600 font-bold mt-2 text-lg">${p.price}</p>
              <button
                onClick={() => openOrderModal(p._id)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Place Order
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Place Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Place an Order</h3>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              />
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - ${p.price}
                  </option>
                ))}
              </select>
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Your Orders Modal */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative overflow-y-auto max-h-[80vh]">
            <button
              onClick={() => setIsOrdersModalOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Your Orders</h3>
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-md border hover:shadow transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {o.customerName} &rarr; {o.product?.name}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      Ordered Product: {o.product?.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(o.status)}`}
                  >
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
