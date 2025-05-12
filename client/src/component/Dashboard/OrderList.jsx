import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatus, fetchOrders } from '../../redux/orderSlice';

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  const user = useSelector((state) => state.auth.user);

  if (user.role !== 'Manager') return null; // 🔒 Show nothing if not Manager

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status })).then(() => dispatch(fetchOrders()));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border">Customer</th>
              <th className="px-4 py-3 border">Product</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Update Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {orders.map((o, index) => (
              <tr key={o._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 border">{o.customerName}</td>
                <td className="px-4 py-2 border">{o.product?.name || 'N/A'}</td>
                <td className="px-4 py-2 border font-medium">{o.status}</td>
                <td className="px-4 py-2 border">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
