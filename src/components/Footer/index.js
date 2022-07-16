import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import {
//   FaHome,
//   FaSignInAlt,
//   FaUserAlt,
//   FaCircle,
//   FaPowerOff,
// } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

const logoDiman = require('../../assets/img/logo_infra_diman.png');

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="py-5 bg-dark">
      <Container className="px-4 mb-0">
        <p className="text-center text-white">
          Copyright &copy; Your Website 2021
        </p>
        <button
          onClick={() => {
            navigate(-1, { state: {}, replace: false });
          }}
          type="button"
        >
          Go back
        </button>
      </Container>
    </footer>
  );
}
