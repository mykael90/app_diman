import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Reports from './Reports'

import Record from './Record';
import List from './Record/List';
import Add from './Record/Add';

const ROLES = {
  adm: 100,
  adm_materials: 200,
  super_materials: 201,
  common_materials: 202,
};

export default function MaterialsRoutes() {
  return (

      


    <Routes>
      <Route path="reports" element={<Reports />}>
      </Route>

      <Route path="record" element={<Record />}>
        <Route path="list" element={<List />} />{' '}
        <Route path="add" element={<Add />} />{' '}
      </Route>
    </Routes>
  );
}
