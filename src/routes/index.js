import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './RequireAuth';

import Aluno from '../pages/Aluno';
import Alunos from '../pages/Alunos';
import Fotos from '../pages/Fotos';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NovoLogin from '../pages/NovoLogin';
import Page404 from '../pages/Page404';
import Unauthorized from '../components/Unauthorized';

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};

export default function RoutesPages() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<h1>Página de início</h1>} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/novologin" element={<NovoLogin />} />
      <Route path="/register" element={<Register />} />

      <Route path="/Unauthorized" element={<Unauthorized />} />
      {/* we want to protect these routes */}
      <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
        <Route path="/aluno/:id/edit" element={<Aluno />} />
        <Route path="/aluno/" element={<Aluno />} />
        <Route path="/fotos/:id" element={<Fotos />} />
        <Route path="/alunos" element={<Alunos />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
