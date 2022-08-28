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
import { Container, Nav, NavDropdown } from 'react-bootstrap';

import * as actions from '../../store/modules/auth/actions';
import { StyledNav, StyledNavbar } from './styled';

import { primaryDarkColor } from '../../config/colors';

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
      <StyledNav />

      <StyledNavbar
        collapseOnSelect
        expand="md"
        className="border-bottom border-2 justify-content-center"
        style={{ background: '#F8F9FA' }}
      >
        <Container>
          <StyledNavbar.Brand className="mt-1">
            <Link to="/Home">
              <img
                src={logoSisman}
                height="25"
                className="d-inline-block align-top"
                alt="Sisman logo"
              />
            </Link>
          </StyledNavbar.Brand>
          <StyledNavbar.Toggle aria-controls="responsive-StyledNavbar-nav" />
          <StyledNavbar.Collapse
            id="responsive-StyledNavbar-nav"
            clas="d-flex justify-content-between"
          >
            <Nav className="me-auto mt-2 px-2">
              <Nav.Link href="#1" onClick={() => navigate('/colaboradores')}>
                COLAB
              </Nav.Link>

              <NavDropdown title="MATERIAL" id="collasible-nav-dropdown">
                <NavDropdown.Item // teste
                  href="#2"
                  onClick={() => navigate('/materials/in/sipac')}
                >
                  Entrada
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#3"
                  onClick={() => navigate('/materials/out/use')}
                >
                  Saída
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  href="#4"
                  onClick={() => navigate('/materials/reports/inventory')}
                >
                  Relatórios
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  href="#4"
                  onClick={() => navigate('/materials/record/list')}
                >
                  Cadastro
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="#5" onClick={() => navigate('/equip')}>
                EQUIP
              </Nav.Link>

              <Nav.Link href="#6" onClick={() => navigate('/eletrica')}>
                ELÉTRICA
              </Nav.Link>

              <NavDropdown title="AGUA" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#7">Poços artesianos</NavDropdown.Item>
                <NavDropdown.Item href="#8">
                  Reservatórios Elevados
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#9">Manobras</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#10">Relatórios</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="#11" onClick={() => navigate('/esgoto')}>
                ESGOTO
              </Nav.Link>

              <Nav.Link href="#12" onClick={() => navigate('/drenagem')}>
                DRENAGEM
              </Nav.Link>

              <Nav.Link href="#13" onClick={() => navigate('/pavimento')}>
                PAVIMENTO
              </Nav.Link>

              <Nav.Link href="#14" onClick={() => navigate('/edificio')}>
                EDIFÍCIO
              </Nav.Link>
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
                  <Nav.Link href="#15">
                    <Link to="/register">
                      <div className="text-nowrap flex-nowrap">
                        <FaUserEdit className="pb-1" size={18} />
                      </div>
                    </Link>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="#16">
                    <Link to="/login">
                      <div className="text-nowrap flex-nowrap">
                        <FaUser
                          className="pb-1"
                          size={18}
                          style={{ color: primaryDarkColor }}
                        />
                        <span className="ms-2" style={{ color: 'gray' }}>
                          Login
                        </span>
                      </div>
                    </Link>
                  </Nav.Link>
                  <Nav.Link href="#17">
                    <Link to="/register">
                      <div className="text-nowrap flex-nowrap">
                        <FaUserPlus
                          className="pb-1"
                          size={18}
                          style={{ color: primaryDarkColor }}
                        />
                        <span className="ms-2" style={{ color: 'gray' }}>
                          Registro
                        </span>
                      </div>
                    </Link>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </StyledNavbar.Collapse>
        </Container>
      </StyledNavbar>
    </>
  );
}
