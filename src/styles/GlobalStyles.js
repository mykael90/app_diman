import styled, { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import * as colors from '../config/colors';

export default createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }
  body {
    font-family: sans-serif;
  }
  html, body, #root {
    height: 100%;
  }

  a {
    text-decoration: none;
    color: ${colors.primaryColor};
  }
  ul {
    list-style: none;
  }



`;

export const Container = styled.section`
  max-width: 360px;
  background: #fff;
  margin: 30px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
