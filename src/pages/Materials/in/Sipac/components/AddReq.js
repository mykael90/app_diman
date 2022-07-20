/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { FaPlus } from 'react-icons/fa';

export default function AddReq({ newReq, setNewReq, submitReq }) {
  const inputRef = useRef();

  return (
    <form className="addForm" onSubmit={submitReq}>
      <label htmlFor="addReq">
        <input
          autoFocus
          ref={inputRef}
          id="addReq"
          type="text"
          placeholder="Digitar requisição"
          required
          value={newReq}
          onChange={(e) => setNewReq(e.target.value)}
        />
      </label>
      <button
        type="submit"
        aria-label="Add Req"
        onClick={() => inputRef.current.focus()}
      >
        <FaPlus />
      </button>
    </form>
  );
}
