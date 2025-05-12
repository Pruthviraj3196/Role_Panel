import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/productSlice';
import { fetchOrders } from '../../redux/orderSlice';
import { fetchUsers, fetchManagerTeam } from '../../redux/userSlice';

import ProductForm from './ProductForm';
import ProductList from './ProductList';
import OrderForm from './OrderForm';
import OrderList from './OrderList';
import UserManagement from './UserManagement';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const managerTeam = useSelector((state) => state.users.team);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    if (user?.role === 'Admin') dispatch(fetchUsers());
    if (user?.role === 'Manager') dispatch(fetchManagerTeam());
  }, [dispatch, user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard ({user.role})</h1>

      {(user.role === 'Admin' || user.role === 'Manager') && (
        <>
          <ProductForm />
          <ProductList />
        </>
      )}

      {user.role === 'Employee' && <OrderForm />}

      {user.role !== 'Employee' && <OrderList />}

      {user.role === 'Admin' && <UserManagement />}

      {user.role === 'Manager' && (
        <div className="bg-white shadow rounded-lg p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">My Team</h2>
          {managerTeam.length === 0 ? (
            <p className="text-gray-500">No team members assigned.</p>
          ) : (
            <ul className="space-y-2">
              {managerTeam.map((emp) => (
                <li key={emp._id} className="p-2 border rounded">
                  <strong>{emp.name}</strong> - {emp.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
