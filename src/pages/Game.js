import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { fetchToken } from '../actions';

class Game extends React.Component {
  constructor() {
    super();
    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.shuffle = this.shuffle.bind(this);
  }

state = {
  arrayOfQuestions: [],
  isLoading: false,
}

reloadToken = async () => { // Valida o token caso expirado;
  console.log('estou na reloadToken');
  const { fetchDispatch } = this.props;
  await fetchDispatch();
  this.fetchQuestion();
}

shuffle(array) { // Embaralha as alternativas;
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

async fetchQuestion() { // Faz requisição a API
  console.log('entrei no fetchQuestion');
  this.setState({ isLoading: true });
  const { token } = this.props;
  console.log('Esse é o token =>', token);
  if (token === '') this.reloadToken(); // Caso o token tenha expirado irá chamar a função para validar o token;
  const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
  const response = await fetch(url);
  const questions = await response.json();
  const listOfQuestions = questions.results;
  let answersWrongs = []; // Array com as respostas erradas;
  let answerRight = []; // Array com as respostas corretas;

  listOfQuestions.forEach((question) => { // Percorre as questões, atribuindo a chave type
    answersWrongs = question.incorrect_answers.map((answer) => ({ // com valor wrong para as questões erradas
      answer,
      type: 'wrong',
    }));
    answerRight = question.correct_answer;
    answersWrongs.push({ answer: answerRight });
    this.shuffle(answersWrongs);
    question.test = answersWrongs;
  });

  this.setState({ arrayOfQuestions: questions.results,
    isLoading: false });
}

render() {
  const { arrayOfQuestions, isLoading } = this.state;
  return (
    <div>
      <Header />
      <span>
        <button
          type="button"
          className="btn-settings"
          data-testid="btn-settings"
          onClick={ this.fetchQuestion }
        >
          Buscar perguntas
        </button>
      </span>
      {
        isLoading
          ? <h2>Carregando</h2>
          : arrayOfQuestions.map((question, index) => (
            <div key={ index }>
              <h2 data-testid="question-category">
                {question.category}
              </h2>
              <h3 data-testid="question-text">{question.question}</h3>
              <div data-testid="answer-options">
                { (question.test.map((answer) => (
                  answer.type
                    ? <h4 data-testeid={ `wrong-answer-${index}` }>{answer.answer}</h4> // Falta adicionar o index correto em cada wrong-answer;
                    : <h4 data-testeid="correct-answer">{answer.answer}</h4>
                ))) }
              </div>
            </div>

          ))
      }
    </div>
  );
}
}

Game.propTypes = {
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  fetchDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDispatch: () => dispatch(fetchToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
