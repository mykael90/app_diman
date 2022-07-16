import React from 'react';
import { Route, Routes } from 'react-router-dom';

import InSipac from './in/Sipac';
import OutUse from './out/Use';

export default function MaterialsRoutes() {
  return (
    <Routes>
      <Route path="in/sipac" element={<InSipac />} />
      <Route path="out/use" element={<OutUse />} />
    </Routes>
  );
}
