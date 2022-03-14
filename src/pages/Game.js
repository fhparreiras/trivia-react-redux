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
  };

  componentDidMount() {
    const { questionsIndex } = this.state;
    console.log(questionsIndex);
    this.fetchQuestion();
  }

fetchQuestion = async () => { // Faz requisição a API
  console.log('entrei no fetchQuestion');
  this.setState({ isLoading: true });
  const { token } = this.props;
  console.log('Esse é o token =>', token);
  if (token === '') return this.reloadToken(); // Caso o token tenha expirado irá chamar a função para validar o token;
  const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
  const response = await fetch(url);
  // console.log(response);
  const questions = await response.json();
  const responseCode = questions.response_code;
  console.log('esse e o response code', responseCode);

  const magicNumber = 3;
  if (responseCode === magicNumber) {
    return this.reloadToken();
    // url = `https://opentdb.com/api.php?amount=5&token=${token}`;
    // response = await fetch(url);
    // questions = await response.json();
    // responseCode = questions.response_code;
    // console.log('esse e o response code atualizado', responseCode);
    // console.log('Esse é o token atualizado =>', token);
  }
  // console.log('Esse é o token atualizado =>', token);
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
  console.log('Estou na fetchQuestions :', questions.results);
  this.setState({ arrayOfQuestions: questions.results,
    isLoading: false });
}

reloadToken = async () => { // Valida o token caso expirado;
  console.log('estou na reloadToken');
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
}

render() {
  const { arrayOfQuestions, isLoading, questionsIndex } = this.state;
  const question = arrayOfQuestions;
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
          // : arrayOfQuestions.map((question, index) => (
          //   <div key={ index }>
          //     <h2 data-testid="question-category">
          //       {question.category}
          //     </h2>
          //     <h3 data-testid="question-text">{question.question}</h3>
          //     <div data-testid="answer-options">
          //       { (question.test.map((answer) => (
          //         answer.type
          //           ? <h4 data-testeid={ `wrong-answer-${index}` }>{answer.answer}</h4> // Falta adicionar o index correto em cada wrong-answer;
          //           : <h4 data-testeid="correct-answer">{answer.answer}</h4>
          //       ))) }
          //     </div>
          //   </div>
          // ))
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
                        type="button"
                        data-testid={ `wrong-answer-${[index]}` }
                        id="wrong"
                        onClick={ this.onQuestionClick }
                      >
                        {answer.answer}
                      </button>
                    )
                    : (
                      <button
                        type="button"
                        data-testid="correct-answer"
                        id="right"
                        onClick={ this.onQuestionClick }
                      >
                        {answer.answer}
                      </button>
                    )
                ))) }
              </div>
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
