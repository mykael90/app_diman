import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './RequireAuth';

import Aluno from '../pages/Aluno';
import Alunos from '../pages/Alunos';
import Fotos from '../pages/Fotos';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Colaboradores from '../pages/Colaboradores';
import Materials from '../pages/Materials';
import Equip from '../pages/Equip';
import Eletrica from '../pages/Eletrica';
import Agua from '../pages/Agua';
import Esgoto from '../pages/Esgoto';
import Drenagem from '../pages/Drenagem';
import Pavimento from '../pages/Pavimento';
import Edificio from '../pages/Edificio';
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
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route exact path="/colaboradores/*" element={<Colaboradores />} />
      <Route exact path="/materials/*" element={<Materials />} />
      <Route exact path="/equip/*" element={<Equip />} />
      <Route exact path="/eletrica/*" element={<Eletrica />} />
      <Route exact path="/agua/*" element={<Agua />} />
      <Route exact path="/esgoto/*" element={<Esgoto />} />
      <Route exact path="/drenagem/*" element={<Drenagem />} />
      <Route exact path="/pavimento/*" element={<Pavimento />} />
      <Route exact path="/edificio/*" element={<Edificio />} />

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
