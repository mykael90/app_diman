import styled from 'styled-components';

export const Title = styled.h1``;

export const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  input {
    margin-top: 5px;
    margin-bottom: 20px;
    height: 40px;
    padding: 0 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  label {
    display: flex;
    flex-direction: column;
  }
`;
