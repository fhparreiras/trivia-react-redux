import { ADD_PLAYER } from '../actions';

const INITIAL_STATE = {
  name: '', // nome-da-pessoa,
  assertions: 0, // número-de-acertos,
  score: 0, // pontuação,
  gravatarEmail: '', // email-da-pessoa,
};

function player(state = INITIAL_STATE, action) {
  switch (action.type) {
  case ADD_PLAYER: // corrigir
    return {
      ...state,
      email: action.payload,
    };
  default:
    return state;
  }
}

export default player;
