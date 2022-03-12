import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import PropTypes from 'prop-types';
import Header from '../components/Header';

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
  console.log(array);
  return array;
}

async fetchQuestion() { // Faz requisição a API
  console.log('entrei no fetchQuestion');
  this.setState({ isLoading: true });
  const { token } = this.props;
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
              { (question.test.map((answer) => (
                answer.type
                  ? <h4 data-testeid="incorrect-answers">{answer.answer}</h4>
                  : <h4 data-testeid="correct-answer">{answer.answer}</h4>
              ))) }
            </div>

          ))
      }
    </div>
  );
}
}

Game.propTypes = {
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.token,
});

export default connect(mapStateToProps)(Game);
