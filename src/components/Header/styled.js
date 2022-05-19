import styled from 'styled-components';
import { primaryColor } from '../../config/colors';

export const Nav1 = styled.nav`
  background: ${primaryColor};
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
