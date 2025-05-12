## MERN Stack Application - Team Management, User Roles, Product & Order Management
## Overview
This application is built using the MERN stack (MongoDB, Express.js, React, Node.js) and provides functionality for team management, user roles, product management, and order management. It supports multiple user roles with different permissions, including Admin, Manager, and Employee.

## Hosted Link - https://role-panel-2.onrender.com

## Features
#### Team Management
## Admin:

- Add New Team Members: Admin can add new team members, assign them to roles, and manage their information.

- Assign Roles: Admin can assign roles to team members (Manager or Employee).

## Manager:
- View Assigned Team Members: Managers can view the employees assigned to their team by the admin.

## User Roles and Permissions
- The application implements user authentication and authorization based on the following roles:

## Admin:

- Can add and manage team members.

- Can assign roles to team members (Manager or Employee).

## Manager:

- Can view and manage orders placed by their team members.

## Employee:

- Can place orders.

## Product Management
## Admin & Managers:

- Can add, edit, and manage products.

## Order Management
## Employees:

- Can place orders for products.

- Each order contains the following attributes:

- Customer Name

## Product Details

## Order Status:

- Pending

- Delivered

- Cancelled

## Technologies Used
- Frontend: React, Redux Toolkit, Tailwind CSS

- Backend: Node.js, Express.js, MongoDB

- Authentication: JWT (JSON Web Tokens)

