import React from 'react';
import { Route, Routes } from 'react-router-dom';

import usersRoletypes from '../../assets/JSON/data/usersRoletypes.json';

import Record from './Record';
import List from './Record/List';
import Add from './Record/Add';
import Reports from './Reports';
import Contracts from './Contracts';
import ContractsList from './Contracts/List';
import ContractsAdd from './Contracts/Add';

const roles = usersRoletypes.reduce(
  (acc, cur) => ({ ...acc, [cur.role]: cur.id }),
  {}
);

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
