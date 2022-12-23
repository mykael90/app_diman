import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Reports from './Reports';

import Record from './Record';
import List from './Record/List';
import Add from './Record/Add';

import Frequency from './Frequency';
import FacialRecognition from './Frequency/FacialRecognition';
import FrequencyManual from './Frequency/Manual';

const ROLES = {
  adm: 100,
  adm_materials: 200,
  super_materials: 201,
  common_materials: 202,
};

export default function MaterialsRoutes() {
  return (
    <Routes>
      <Route path="reports" element={<Reports />} />

      <Route path="record" element={<Record />}>
        <Route path="list" element={<List />} />{' '}
        <Route path="add" element={<Add />} />{' '}
        <Route path="update/:id" element={<Add />} />{' '}
      </Route>

      <Route path="frequency" element={<Frequency />}>
        <Route path="facialrecognition" element={<FacialRecognition />} />{' '}
        <Route path="manual" element={<FrequencyManual />} />{' '}
      </Route>
    </Routes>
  );
}
