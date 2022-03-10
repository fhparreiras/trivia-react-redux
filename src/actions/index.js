// actions do estado global
import getToken from '../services/gravatarAPI';

export const ADD_NAME = 'ADD_NAME';

export const saveName = (name) => ({
  type: ADD_NAME,
  payload: name,
});

export const ADD_EMAIL = 'ADD_EMAIL';

export const saveEmail = (email) => ({
  type: ADD_EMAIL,
  payload: email,
});

// actions para lidar com a requisição à API
export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const GET_TOKEN_SUCCESS = 'GET_TOKEN_SUCCESS';
export const GET_TOKEN_ERROR = 'GET_TOKEN_ERROR';

const requestToken = () => ({
  type: REQUEST_TOKEN,
});

const getTokenSuccess = (token) => ({
  type: GET_TOKEN_SUCCESS,
  payload: token,
});

const getTokenError = (error) => ({
  type: GET_TOKEN_ERROR,
  payload: error,
});

export const fetchToken = () => async (dispatch) => {
  dispatch(requestToken());

  try {
    const token = await getToken();
    dispatch(getTokenSuccess(token));
  } catch (error) {
    dispatch(getTokenError(error.message));
  }
};
