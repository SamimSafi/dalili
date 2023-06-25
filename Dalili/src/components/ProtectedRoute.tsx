import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ path, component: Component }) => {
  const token = localStorage.getItem('token');

  return token ? (
    <Route path={path} element={<Component />} />
  ) : (
    <Navigate to="/404" />
  );
};

export default ProtectedRoute;