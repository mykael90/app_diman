/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  valorBotao: false,
};

export const botaoClicadoSlice = createSlice({
  name: 'botaoClicado',
  initialState,
  reducers: {
    toogleButton: (state) => {
      state.valorBotao = !state.valorBotao;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toogleButton } = botaoClicadoSlice.actions;

export const selectValorBotao = (state) => state.botaoClicado.valorBotao;

export default botaoClicadoSlice.reducer;
