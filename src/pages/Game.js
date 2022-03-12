import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import PropTypes from 'prop-types';
import Header from '../components/Header';
// import Questions from '../components/Questions';

class Game extends React.Component {
  constructor() {
    super();
    this.fetchQuestion = this.fetchQuestion.bind(this);
  }

state = {
  arrayOfQuestions: [],
  isLoading: false,
}

async fetchQuestion() {
  console.log('entrei no fetchQuestion');
  this.setState({ isLoading: true });
  const { token } = this.props;
  const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
  const response = await fetch(url);
  const questions = await response.json();
  this.setState = ({ arrayOfQuestions: questions.results, isLoading: false });
  console.log(questions.results);
}

render() {
  const { arrayOfQuestions, isLoading } = this.state;
  // const arrayEmpty = arrayOfQuestions.length === 0;
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
            <h2 key={ index }>{question.category}</h2>
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

// linha 47 => <Questions questions={ [...arrayOfQuestions] } />
