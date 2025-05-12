import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignRole, assignToTeam } from '../../redux/userSlice';

export default function UserManagement() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list); // ✅ use state.users.list

  const [selectedManager, setSelectedManager] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const handleRoleChange = (id, role) => {
    dispatch(assignRole({ id, role }));
  };

  const handleAssignToTeam = () => {
    if (selectedManager && selectedEmployee) {
      dispatch(assignToTeam({ managerId: selectedManager, employeeId: selectedEmployee }));
      setSelectedManager('');
      setSelectedEmployee('');
    }
  };

  const managers = users.filter((u) => u.role === 'Manager');
  const employees = users.filter((u) => u.role === 'Employee');

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h2>

      {/* User Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full table-auto border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Role</th>
              <th className="px-4 py-3 border">Change Role</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {users.map((u, index) => (
              <tr
                key={u._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition'}
              >
                <td className="px-4 py-2 border">{u.name}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border font-medium">{u.role}</td>
                <td className="px-4 py-2 border">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1"
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

      {/* Assign Employee to Manager Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Assign Employee to Manager</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.name} ({manager.email})
              </option>
            ))}
          </select>

          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignToTeam}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Assign to Team
          </button>
        </div>
      </div>
    </div>
  );
}
