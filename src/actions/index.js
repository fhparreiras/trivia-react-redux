import { getToken } from '../services/triviaAPI';

export const ADD_DATA = 'ADD_DATA';

export const saveName = (name, email) => ({
  type: ADD_DATA,
  payload: name,
  email,
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
