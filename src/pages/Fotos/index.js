import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Title, Paragrafo } from './styled';
import axios from '../../services/axios';

export default function Login() {
  React.useEffect(() => {
    async function getData() {
      const response = await axios.get('/alunos');
      const { data } = response;
      console.log(data);
    }
    getData();
  });

  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleClick = () => {
    setAuth({
      user: 'Mykael',
      pwd: '1234',
      roles: [5150],
      accessToken: 'njfksh123912203',
    });
    navigate(from, { replace: true });
  };

  return (
    <>
      <Title>
        Login
        <small>Oie</small>
      </Title>
      <Paragrafo>lorem ipsum dolor sit amet.</Paragrafo>
      <a href="http://localhost:3000/">OIeee</a>
      <button type="button" onClick={handleClick}>
        Clicar!
      </button>
    </>
  );
}
