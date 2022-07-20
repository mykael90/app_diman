/* eslint-disable react/prop-types */
import React from 'react';

import ReqList from './ReqList';

export default function Content({
  reqs,
  deleteReq,
  handleClear,
  handleSubmit,
}) {
  return (
    <main>
      {reqs.length ? (
        <ReqList
          reqs={reqs}
          deleteReq={deleteReq}
          handleClear={handleClear}
          handleSubmit={handleSubmit}
        />
      ) : (
        <p style={{ marginTop: '2rem' }}>Lista de importação vazia.</p>
      )}
    </main>
  );
}
