import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Unidade from './Unidade';

const ROLES = {
  adm: 100,
  adm_materials: 200,
  super_materials: 201,
  common_materials: 202,
};

export default function MaterialsRoutes() {
  return (
    <Routes>
      <Route path="unidades" element={<Unidade />} />
    </Routes>
  );
}
