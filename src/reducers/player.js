import { ADD_DATA, ADD_DATA_SCORE } from '../actions';

const INITIAL_STATE = {
  name: '', // nome-da-pessoa,
  assertions: 0, // número-de-acertos,
  score: 0, // pontuação,
  gravatarEmail: '', // email-da-pessoa,
};

function player(state = INITIAL_STATE, action) {
  switch (action.type) {
  case ADD_DATA:
    return {
      ...state,
      name: action.payload.name,
      gravatarEmail: action.payload.email,
    };
  case ADD_DATA_SCORE:
    return {
      ...state,
      score: action.payload.score,
    };
  default:
    return state;
  }
}

export default player;
