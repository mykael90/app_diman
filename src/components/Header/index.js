import React from 'react';
import {
  FaHome,
  FaSignInAlt,
  FaUserAlt,
  FaCircle,
  FaPowerOff,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import * as actions from '../../store/modules/auth/actions';
import { Nav } from './styled';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(actions.loginFailure());
    navigate('/', { replace: true });
    toast.success('Sessão encerrada');
  };

  return (
    <Nav>
      <Link to="/Home">
        <FaHome size={24} />
      </Link>
      <Link to="/Register">
        <FaUserAlt size={24} />
      </Link>
      {isLoggedIn ? (
        <Link to="/logout">
          <FaPowerOff size={24} onClick={handleLogout} />
        </Link>
      ) : (
        <Link to="/Login">
          <FaSignInAlt size={24} />
        </Link>
      )}

      <button
        onClick={() => {
          navigate(-1, { state: {}, replace: false });
        }}
        type="button"
      >
        Go back
      </button>
      {isLoggedIn && <FaCircle size={24} color="#66ff33" />}
    </Nav>
  );
}
