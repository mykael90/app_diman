import React from 'react';
import {
  FaUser,
  FaUserEdit,
  FaCircle,
  FaUserPlus,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import * as actions from '../../store/modules/auth/actions';
import { Nav1 } from './styled';

import { body1Color } from '../../config/colors';

const logoSisman = require('../../assets/img/logo-sisman.png');

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const nameStored = useSelector((state) => state.auth.user.name);

  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(actions.loginFailure());
    navigate('/', { replace: true });
    toast.success('Sessão encerrada');
  };

  return (
    <>
      <Nav1 />

      <Navbar
        collapseOnSelect
        expand="md"
        className="border-bottom border-2 justify-content-center"
        style={{ background: '#F8F9FA' }}
      >
        <Container>
          <Navbar.Brand className="mt-1">
            <Link to="/Home">
              <img
                src={logoSisman}
                height="25"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            clas="d-flex justify-content-between"
          >
            <Nav className="me-auto mt-2 px-2">
              <Nav.Link href="#pricing">COLAB</Nav.Link>

              <NavDropdown title="MATERIAL" id="collasible-nav-dropdown">
                <NavDropdown.Item>
                  <Link to="/materials/in/sipac">Entrada</Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link to="/materials/out/use">Saída</Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Relatórios
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="#pricing">EQUIP</Nav.Link>

              <Nav.Link href="#pricing">ELÉTRICA</Nav.Link>

              <NavDropdown title="AGUA" id="collasible-nav-dropdown">
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

              <Nav.Link href="#pricing">ESGOTO</Nav.Link>

              <Nav.Link href="#pricing">DRENAGEM</Nav.Link>

              <Nav.Link href="#pricing">PAVIMENTO</Nav.Link>

              <Nav.Link href="#pricing">EDIFÍCIO</Nav.Link>
            </Nav>

            <Nav className="me-0 mt-2">
              {isLoggedIn ? (
                <>
                  <Nav.Link>
                    <div className="text-nowrap flex-nowrap">
                      <FaCircle className="pb-0" size={14} color="#66ff33" />
                      <span className="ms-2">{nameStored}</span>
                    </div>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/logout">
                      <div className="text-nowrap flex-nowrap">
                        <FaSignOutAlt
                          className="pb-1"
                          size={18}
                          onClick={handleLogout}
                        />
                      </div>
                    </Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/register">
                      <div className="text-nowrap flex-nowrap">
                        <FaUserEdit className="pb-1" size={18} />
                      </div>
                    </Link>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link>
                    <Link to="/login">
                      <div className="text-nowrap flex-nowrap">
                        <FaUser className="pb-1" size={18} />
                        <span className="ms-2">Login</span>
                      </div>
                    </Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/register">
                      <div className="text-nowrap flex-nowrap">
                        <FaUserPlus className="pb-1" size={18} />
                        <span className="ms-2">Registro</span>
                      </div>
                    </Link>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
