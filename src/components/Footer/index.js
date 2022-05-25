import React from 'react';
import { Container } from 'react-bootstrap';
// import {
//   FaHome,
//   FaSignInAlt,
//   FaUserAlt,
//   FaCircle,
//   FaPowerOff,
// } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

const logoDiman = require('../../img/logo_infra_diman.png');

export default function Footer() {
  return (
    <footer className="py-5 my-5 bg-dark">
      <Container className="px-4">
        <p className="text-center text-white">
          Copyright &copy; Your Website 2021
        </p>
      </Container>
    </footer>
  );
}
