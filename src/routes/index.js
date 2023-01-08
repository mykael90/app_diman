import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './RequireAuth';

import LightBox from '../components/LightBox';
import Aluno from '../pages/Aluno';
import Alunos from '../pages/Alunos';
import Fotos from '../pages/Fotos';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Collaborator from '../pages/Collaborator';
import Materials from '../pages/Materials';
import Equip from '../pages/Equip';
import Eletrica from '../pages/Infra/Eletrica';
import Agua from '../pages/Infra/Agua';
import Esgoto from '../pages/Infra/Esgoto';
import Drenagem from '../pages/Infra/Drenagem';
import Pavimento from '../pages/Infra/Pavimento';
import Edificio from '../pages/Infra/Edificio';
import Page404 from '../pages/Page404';
import Providers from '../pages/Providers';
import Unauthorized from '../components/Unauthorized';

import Test from '../pages/Materials/Reports/Output/components/EditModal';

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
      <Route path="/lightbox" element={<LightBox />} />

      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route exact path="/collaborator/*" element={<Collaborator />} />

      <Route exact path="/equip/*" element={<Equip />} />
      <Route exact path="/infra/eletrica/*" element={<Eletrica />} />
      <Route exact path="/infra/agua/*" element={<Agua />} />
      <Route exact path="/infra/esgoto/*" element={<Esgoto />} />
      <Route exact path="/infra/drenagem/*" element={<Drenagem />} />
      <Route exact path="/infra/pavimento/*" element={<Pavimento />} />
      <Route exact path="/infra/edificio/*" element={<Edificio />} />
      <Route exact path="/providers/*" element={<Providers />} />

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

      <Route exact path="/test/*" element={<Test />} />

      {/* catch all */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
