import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { fetchToken } from '../actions';

class Game extends React.Component {
  state = {
    arrayOfQuestions: [],
    isLoading: true,
    questionsIndex: 0,
    isButtonDisabled: false,
    timer: 30, // inicia o contador em 30 segundos
    isNextHidden: true,
  };

  componentDidMount() {
    const { isButtonDisabled, timer } = this.state;
    this.fetchQuestion();
    const ONE_SECOND = 1000;
    // essa setInterval faz ser atualizado o estado do timer de 1 em 1 segundo para -1 segundo
    setInterval(() => {
      if (isButtonDisabled === false && timer > 0) {
        this.setState((prevState) => ({
          isLoading: false,
          timer: prevState.timer - 1,
        }));
      }
    }, ONE_SECOND);
    const THIRTY_SECONDS = 30000;
    // a setTimeout define 30 segundos para que, após eles, os botões das alternativas fiquem desabilitados
    // através da atualização do estado "isButtoDisabled" para true
    setTimeout(() => {
      this.setState({
        isButtonDisabled: true,
      });
    }, THIRTY_SECONDS);
  }

fetchQuestion = async () => { // Faz requisição a API
  this.setState({ isLoading: true });
  const { token } = this.props;
  if (token === '') return this.reloadToken(); // Caso o token tenha expirado irá chamar a função para validar o token;
  const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
  const response = await fetch(url);
  const questions = await response.json();
  const responseCode = questions.response_code;

  const magicNumber = 3;
  if (responseCode === magicNumber) {
    return this.reloadToken();
  }

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

reloadToken = async () => { // Valida o token caso expirado;
  const { fetchDispatch } = this.props;
  await fetchDispatch();
  await this.fetchQuestion();
}

shuffle = (array) => { // Embaralha as alternativas;
  let currentIndex = array.length;
  let randomIndex;

  // While para enquanto ainda houver elementos para embaralhar...
  while (currentIndex !== 0) {
    // Pega um elemento ainda remanescente...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Troca com o elemento atual
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

onQuestionClick = () => {
  document.querySelector('#right').className = 'right';
  const btnWrong = document.querySelectorAll('#wrong');
  btnWrong.forEach((btn) => { btn.className = 'wrong'; });
  this.setState({
    isNextHidden: false,
  });
}

onNextClick = () => {
  document.querySelector('#right').className = '';
  const btnWrong = document.querySelectorAll('#wrong');
  btnWrong.forEach((btn) => { btn.className = ''; });
  this.setState({
    isButtonDisabled: false,
    isNextHidden: true,
    isLoading: true,
    timer: 30,
  });
}

render() {
  const { arrayOfQuestions, isLoading, isNextHidden,
    isButtonDisabled, questionsIndex, timer } = this.state;
  const question = arrayOfQuestions;
  return (
    <div>
      <Header />
      <h2>
        { !isLoading && timer >= 0 ? timer : '' }
      </h2>
      {
        isLoading
          ? <h2>Carregando</h2>
          : (
            <div>
              <h2 data-testid="question-category">
                {question[questionsIndex].category}
              </h2>
              <h3 data-testid="question-text">{question[questionsIndex].question}</h3>
              <div data-testid="answer-options">
                { (question[questionsIndex].test.map((answer, index) => (
                  answer.type
                    ? (
                      <button
                        key={ index }
                        type="button"
                        data-testid={ `wrong-answer-${[index]}` }
                        id="wrong"
                        onClick={ this.onQuestionClick }
                        disabled={ isButtonDisabled }
                      >
                        {answer.answer}
                      </button>
                    )
                    : (
                      <button
                        key={ index }
                        type="button"
                        data-testid="correct-answer"
                        id="right"
                        onClick={ this.onQuestionClick }
                        disabled={ isButtonDisabled }
                      >
                        {answer.answer}
                      </button>
                    )
                ))) }
              </div>
              { !isNextHidden
              && (
                <button
                  type="button"
                  data-testid="btn-next"
                  onClick={ this.onNextClick }
                >
                  Next
                </button>
              )}
            </div>
          )
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
