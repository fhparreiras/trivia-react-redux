import React from 'react';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchToken, saveData } from '../actions';
import logo from '../trivia.png';
import '../App.css';

class Login extends React.Component {
  state = {
    inputName: '',
    inputEmail: '',
    isButtonDisabled: true,
    isLogin: false,
    // gravatarHref: '',
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    }, this.handleButton);
  }

  handleButton = () => {
    const { inputEmail, inputName } = this.state;
    const minLength = 1;
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    return inputName.length >= minLength
    && emailRegex.test(inputEmail)
      ? this.setState({ isButtonDisabled: false })
      : this.setState({ isButtonDisabled: true });
  }

  handleButtonClick = async () => {
    const { fetchDispatch, dispatchData } = this.props;
    const { inputEmail, inputName } = this.state;
    // const payload = { 'inputName, inputEmail' };
    await fetchDispatch();
    this.setState({
      isLogin: true,
    });
    const payload = { name: inputName, email: inputEmail };
    dispatchData(payload);
    // fetchGravataImg();

    const hash = md5(inputEmail).toString();
    const url = `https://www.gravatar.com/avatar/${hash}`;
    this.createRankig(url);
  }

  createRankig = (url) => {
    const { inputName } = this.state;

    console.log('entrou no ranking');
    console.log(url);

    const playerData = { name: inputName, score: 0, picture: url };

    console.log(playerData);
    console.log(JSON.parse(localStorage.getItem('ranking')));

    if (localStorage.getItem('ranking') === null) {
      console.log('entrou na criacao do ranking');
      localStorage.setItem('ranking', JSON.stringify([playerData]));
    } else {
      console.log('entrou na ampliacao do ranking');
      const localStArray = JSON.parse(localStorage.getItem('ranking'));
      console.log(localStArray);
      localStArray.push(playerData);
      localStorage.setItem('ranking', JSON.stringify(localStArray));
    }
    console.log(JSON.parse(localStorage.getItem('ranking')));
  }

  render() {
    const { inputEmail, inputName, isButtonDisabled, isLogin } = this.state;
    const { history } = this.props;
    // const { fetchToken } = this.props;
    // console.log(md5('fhparreiras@gmail.com').toString()); comando para transformar o email em hash
    // https://www.gravatar.com/avatar/${hash-gerada} endpoint para transformar o link em imagem
    // <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" /> img gerada com o endpoint

    return (
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <form className="login-form">
          <span>
            <label htmlFor="email">
              <input
                type="email"
                placeholder="E-mail..."
                name="inputEmail"
                data-testid="input-gravatar-email"
                value={ inputEmail }
                onChange={ this.handleChange }
              />
            </label>
          </span>
          <span>
            <label htmlFor="name">
              <input
                type="text"
                placeholder="Nome..."
                name="inputName"
                data-testid="input-player-name"
                value={ inputName }
                onChange={ this.handleChange }
              />
            </label>
          </span>
          <button
            type="button"
            className="btn-login"
            data-testid="btn-play"
            disabled={ isButtonDisabled }
            onClick={ this.handleButtonClick }
          >
            Play
          </button>
          <button
            type="button"
            className="btn-settings"
            data-testid="btn-settings"
            onClick={ () => history.push('/configuracoes') }
          >
            Settings
          </button>
          { isLogin && <Redirect to="/game" />}
        </form>
      </header>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  fetchDispatch: PropTypes.func.isRequired,
  dispatchData: PropTypes.func.isRequired,
  // gravatarEmail: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDispatch: () => dispatch(fetchToken()),
  // dispatchData: () => dispatch(saveData('inputName', 'inputEmail')),
  dispatchData: (payload) => dispatch(saveData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
