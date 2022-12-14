import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { fetchToken, resetScore, saveDataSCORE } from '../actions';

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
    const { dispatchResetScore } = this.props;
    dispatchResetScore();
    const { isButtonDisabled } = this.state;
    this.fetchQuestion();
    const ONE_SECOND = 1000;
    // essa setInterval faz ser atualizado o estado do timer de 1 em 1 segundo para -1 segundo
    setInterval(() => {
      if (isButtonDisabled === false) {
        this.setState((prevState) => ({
          isLoading: false,
          timer: prevState.timer - 1,
        }));
      }
    }, ONE_SECOND);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timer === 1) {
      this.funcTest();
    }
  }

  funcTest = () => {
    this.setState({
      isButtonDisabled: true,
      isNextHidden: false,
    });
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

onQuestionClick = ({ target }) => {
  const { timer, arrayOfQuestions, questionsIndex } = this.state;
  const { id } = target;
  document.querySelector('#right').className = 'right';
  const btnWrong = document.querySelectorAll('#wrong');
  btnWrong.forEach((btn) => { btn.className = 'wrong'; });
  this.setState({
    isNextHidden: false,
  });
  const responseTime = timer;
  if (id === 'right') {
    this.userQuestionScore(responseTime, arrayOfQuestions, questionsIndex);
  }
}

onNextClick = () => {
  const { questionsIndex } = this.state;
  const { history } = this.props;
  document.querySelector('#right').className = '';
  const btnWrong = document.querySelectorAll('#wrong');
  btnWrong.forEach((btn) => { btn.className = ''; });
  this.setState({
    isButtonDisabled: false,
    isNextHidden: true,
    isLoading: true,
    timer: 30,
  });
  const maxLengthIndex = 4; // número máximo para o array com as perguntas;
  if (questionsIndex < maxLengthIndex) { // Se o index < 4
    this.setState((previousState) => ({ // Incrementa mais um e passa para próxima pergunta;
      questionsIndex: previousState.questionsIndex + 1,
    }));
  } else { // Quando chega na última questão => index = 4;
    this.setState({ questionsIndex: 0 });
    history.push('/feedback'); // Retorna o index para zero;
  }
}

userQuestionScore = async (responseTime, arrayOfQuestions, questionsIndex) => {
  const questionDifficulty = arrayOfQuestions[questionsIndex].difficulty;
  const questionMultiplier = { easy: 1, medium: 2, hard: 3 };
  const MINIMUM_SCORE = 10;
  const questionScore = MINIMUM_SCORE
  + (responseTime * questionMultiplier[questionDifficulty]);
  // dipatch que salva o score
  const ASSERTIONS_UP = 1;
  const payload = { score: questionScore, assertions: ASSERTIONS_UP };
  const { dispatchScore } = this.props;
  await dispatchScore(payload);
  this.modifyRannking();
}

modifyRannking = async () => {
  const { score } = this.props;
  const localStArray = JSON.parse(localStorage.getItem('ranking'));
  const lastEntrie = localStArray.length - 1;
  localStArray[lastEntrie].score = score;

  localStorage.setItem('ranking', JSON.stringify(localStArray));
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
                <button type="button" data-testid="btn-next" onClick={ this.onNextClick }>
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
  dispatchScore: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
  dispatchResetScore: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.token,
  name: state.player.name,
  gravatarEmail: state.player.gravatarEmail,
  score: state.player.score,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDispatch: () => dispatch(fetchToken()),
  dispatchScore: (payload) => dispatch(saveDataSCORE(payload)),
  dispatchResetScore: () => dispatch(resetScore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
