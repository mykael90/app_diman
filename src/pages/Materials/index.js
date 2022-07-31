import React from 'react';
import { Route, Routes } from 'react-router-dom';

import In from './in';
import Sipac from './in/Sipac';
import InDonation from './in/Donation';
import Returned from './in/Returned';
import First from './in/First';

import Out from './out';
import Use from './out/Use';
import OutDonation from './out/Donation';
import Devolution from './out/Devolution';
import Loss from './out/Loss';
import Discard from './out/Discard';

import Reports from './Reports';
import Input from './Reports/Input';
import Output from './Reports/Output';
import Inventory from './Reports/Inventory';

import Record from './Record';

export default function MaterialsRoutes() {
  return (
    <Routes>
      <Route path="in" element={<In />}>
        <Route path="sipac" element={<Sipac />} />{' '}
        <Route path="donation" element={<InDonation />} />{' '}
        <Route path="returned" element={<Returned />} />{' '}
        <Route path="first" element={<First />} />{' '}
      </Route>

      <Route path="out" element={<Out />}>
        <Route path="use" element={<Use />} />{' '}
        <Route path="donation" element={<OutDonation />} />{' '}
        <Route path="devolution" element={<Devolution />} />{' '}
        <Route path="discard" element={<Discard />} />{' '}
        <Route path="loss" element={<Loss />} />{' '}
      </Route>

      <Route path="reports" element={<Reports />}>
        <Route path="inventory" element={<Inventory />} />{' '}
        <Route path="Input" element={<Input />} />{' '}
        <Route path="output" element={<Output />} />{' '}
      </Route>

      <Route path="record" element={<Record />} />
    </Routes>
  );
}
