import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Record from './Record';
import List from './Record/List';
import Add from './Record/Add';
import Reports from './Reports';
import Contracts from './Contracts';
import ContractsList from './Contracts/List';
import ContractsAdd from './Contracts/Add';

const ROLES = {
  adm: 100,
  adm_providers: 500,
  super_providers: 501,
  common_providers: 502,
};

export default function providersRoutes() {
  return (
    <Routes>
      <Route path="reports" element={<Reports />} />
      <Route path="contracts" element={<Contracts />}>
        <Route path="list" element={<ContractsList />} />{' '}
        <Route path="add" element={<ContractsAdd />} />{' '}
      </Route>

      <Route path="record" element={<Record />}>
        <Route path="list" element={<List />} />{' '}
        <Route path="add" element={<Add />} />{' '}
      </Route>
    </Routes>
  );
}
