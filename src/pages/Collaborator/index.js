import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Frequency from './Frequency';
import FacialRecognition from './Frequency/FacialRecognition';
import FrequencyManual from './Frequency/Manual';

import Safety from './Safety';
import Risk from './Safety/Risk';
import EPI from './Safety/EPI';

import Reports from './Reports';
import Active from './Reports/Active';
import Effective from './Reports/Effective';
import HourBank from './Reports/HourBank';
import RegisterFrequency from './Reports/Frequency';

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
      <Route path="frequency" element={<Frequency />}>
        <Route path="facialrecognition" element={<FacialRecognition />} />{' '}
        <Route path="manual" element={<FrequencyManual />} />{' '}
      </Route>

      <Route path="safety" element={<Safety />}>
        <Route path="risk" element={<Risk />} />{' '}
        <Route path="epi" element={<EPI />} />{' '}
      </Route>

      <Route path="reports" element={<Reports />}>
        <Route path="active" element={<Active />} />{' '}
        <Route path="effective" element={<Effective />} />{' '}
        <Route path="hourbank" element={<HourBank />} />{' '}
        <Route path="frequency" element={<RegisterFrequency />} />{' '}
      </Route>

      <Route path="record" element={<Record />}>
        <Route path="list" element={<List />} />{' '}
        <Route path="add" element={<Add />} />{' '}
        <Route path="update/:id" element={<Add />} />{' '}
      </Route>
    </Routes>
  );
}
