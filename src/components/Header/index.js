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
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import * as actions from '../../store/modules/auth/actions';
import { Nav1 } from './styled';

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

      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to="/Home">
                <FaHome size={24} />
              </Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
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
