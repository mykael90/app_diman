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

const logoDiman = require('../../img/logo_infra_diman.png');

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

      <Navbar collapseOnSelect expand="md" bg="light">
        <Container>
          <Navbar.Brand>
            <Link to="/Home">
              <img
                src={logoDiman}
                height="40"
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
            <Nav className="me-auto mt-2">
              <Nav.Link href="#pricing">Colaboradores</Nav.Link>
              <Nav.Link>
                <Link to="/materials">Materiais</Link>
              </Nav.Link>
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
