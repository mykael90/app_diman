import styled from 'styled-components';
import { Navbar } from 'react-bootstrap';
import { primaryDarkColor } from '../../config/colors';

export const StyledNav = styled.nav`
  background: ${primaryDarkColor};
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    color: #fff;
    margin: 0 10px 0 0;
    font-weight: bold;
  }
`;

export const StyledNavbar = styled(Navbar)`
  background: '#F8F9FA';
  a,
  a:visited,
  a:hover,
  a:active {
    color: inherit;
    text-decoration: none;
  }
`;
