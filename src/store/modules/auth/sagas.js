/* eslint-disable no-unused-vars */
import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { func } from 'prop-types';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens', payload); // tipo uma promessa
    yield put(actions.loginSuccess({ ...response.data }));
    toast.success('Você fez login');

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    payload.navigate(payload.prevPath, { replace: true });
  } catch (e) {
    const { errors } = e.response.data;

    errors.map((error) => toast.error(error));

    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token');
  if (!token) return;
  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

// eslint-disable-next-line consistent-return
function* registerRequest({ payload }) {
  const { id, name, email, username, password, navigate } = payload;

  try {
    if (id) {
      yield call(axios.put, '/users', {
        email,
        name,
        username,
        password: password || undefined,
      });
      toast.success('Conta alterada com sucesso');
      yield put(
        actions.registerUpdatedSuccess({ name, email, username, password })
      );
    } else {
      yield call(axios.post, '/users', {
        email,
        name,
        username,
        password,
      });
      toast.success('Conta criada com sucesso');
      yield put(
        actions.registerCreatedSuccess({ name, email, username, password })
      );
      return payload.navigate('/login', { replace: true });
    }
  } catch (e) {
    const errors = get(e, 'response.data.error', []);
    const status = get(e, 'response.status', 0);

    if (status === 401) {
      toast.error('Vocë precisa fazer login novamente');
      yield put(actions.loginFailure());
      return navigate('/login', { replace: true });
    }

    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
    } else {
      toast.error('Erro desconhecido');
    }

    yield put(actions.registerFailure());
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
