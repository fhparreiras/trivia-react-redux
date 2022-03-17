import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import '../App.css';
import { resetScore } from '../actions';

class Feedback extends React.Component {
  onPlayAgainClick = () => {
    const { dispatchResetScore, history } = this.props;
    history.push('/');
    dispatchResetScore();
  }

  render() {
    const { assertions, history, score } = this.props;
    console.log('ASSERTIONS: ', this.props);
    const magicNumber = 3;
    return (
      <>
        <Header />
        <h1>FIM DE JOGO!</h1>
        <p data-testid="feedback-total-question">{ assertions }</p>
        <p data-testid="feedback-total-score">{ score }</p>
        <p data-testid="feedback-text">
          { assertions < magicNumber ? 'Could be better...' : 'Well Done!' }
        </p>
        <button
          data-testid="btn-play-again"
          type="button"
          onClick={ this.onPlayAgainClick }
        >
          Jogar novamente
        </button>
        <button
          data-testid="btn-ranking"
          type="button"
          onClick={ () => history.push('/ranking') }
        >
          Ver Ranking
        </button>
      </>
    );
  }
}

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  dispatchResetScore: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchResetScore: () => dispatch(resetScore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
