import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// import useAuth from '../hooks/useAuth';

function RequireAuth({ allowedRoles }) {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  // eslint-disable-next-line no-nested-ternary
  return auth?.user?.roles?.find((role) => allowedRoles?.includes(role.id)) ? (
    <Outlet />
  ) : auth?.user.id ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

RequireAuth.defaultProps = {
  allowedRoles: [],
};

RequireAuth.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  allowedRoles: PropTypes.array,
};

export default RequireAuth;
