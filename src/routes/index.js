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
  adm: 100,
  adm_materials: 200,
  super_materials: 201,
  common_materials: 202,
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

      <Route exact path="/equip/*" element={<Equip />} />
      <Route exact path="/eletrica/*" element={<Eletrica />} />
      <Route exact path="/agua/*" element={<Agua />} />
      <Route exact path="/esgoto/*" element={<Esgoto />} />
      <Route exact path="/drenagem/*" element={<Drenagem />} />
      <Route exact path="/pavimento/*" element={<Pavimento />} />
      <Route exact path="/edificio/*" element={<Edificio />} />

      <Route path="/Unauthorized" element={<Unauthorized />} />
      {/* we want to protect these routes */}
      <Route
        element={
          <RequireAuth
            allowedRoles={[
              ROLES.adm,
              ROLES.adm_materials,
              ROLES.super_materials,
              ROLES.common_materials,
            ]}
          />
        }
      >
        <Route exact path="/materials/*" element={<Materials />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
