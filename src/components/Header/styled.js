import styled from 'styled-components';
import { primaryDarkColor } from '../../config/colors';

export const Nav1 = styled.nav`
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
