import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import '../App.css';

class Feedback extends React.Component {
  render() {
    const { assertions, history } = this.props;
    console.log('ASSERTIONS: ', this.props);
    const magicNumber = 3;
    return (
      <>
        <Header />
        <h1>FIM DE JOGO!</h1>
        <p data-testid="feedback-text">
          { assertions < magicNumber ? 'Could be better...' : 'Well Done!' }
        </p>
        <button
          data-testid="btn-play-again"
          type="button"
          onClick={ () => history.push('/') }
        >
          Jogar novamente
        </button>
      </>
    );
  }
}

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
});

export default connect(mapStateToProps)(Feedback);
