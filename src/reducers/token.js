import { GET_TOKEN_ERROR, GET_TOKEN_SUCCESS } from '../actions';

const INITIAL_STATE = '';

function token(state = INITIAL_STATE, action) {
  switch (action.type) {
  case GET_TOKEN_SUCCESS:
    return action.payload;
  case GET_TOKEN_ERROR:
    return {
      ...state,
      errorMessage: action.payload,
    };
  default:
    return state;
  }
}

export default token;
