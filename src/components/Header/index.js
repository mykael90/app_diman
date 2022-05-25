import React from 'react';
import {
  FaUser,
  FaHome,
  FaSignInAlt,
  FaUserAlt,
  FaCircle,
  FaPowerOff,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import * as actions from '../../store/modules/auth/actions';
import { Nav1 } from './styled';

const logoDiman = require('../../img/logo_infra_diman.png');

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
    <>
      <Nav1>
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
      </Nav1>

      <Navbar collapseOnSelect expand="md" bg="light">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={logoDiman}
              height="40"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to="/Home">
                <FaUser size={24} />
              </Link>
              <Nav.Link href="#features">Conta</Nav.Link>
              <Nav.Link href="#pricing">Colaboradores</Nav.Link>
              <Nav.Link href="#pricing">Materiais</Nav.Link>
              <Nav.Link href="#pricing">Ferramentas</Nav.Link>
              <NavDropdown title="Saneamento" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Abastecimento de água
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Drenagem</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#pricing">Elétrica</Nav.Link>
              <Nav.Link href="#pricing">Pavimentação</Nav.Link>
              <Nav.Link href="#pricing">Edificações</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
