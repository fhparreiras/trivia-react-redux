import { getToken } from '../services/triviaAPI';

export const ADD_DATA = 'ADD_DATA';

export const saveData = (payload) => ({
  type: ADD_DATA,
  payload,
});

export const ADD_DATA_SCORE = 'ADD_DATA_SCORE';

export const saveDataSCORE = (payload) => ({
  type: ADD_DATA_SCORE,
  payload,
});

export const RESET_SCORE = 'RESET_SCORE';

export const resetScore = () => ({
  type: RESET_SCORE,
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
