import React from 'react';
import PropTypes from 'prop-types';
// import md5 from 'crypto-js/md5';
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

  // fetchGravataImg = () => async () => {
  //   const { gravatarEmail } = this.props;
  //   const hash = md5(gravatarEmail).toString();
  //   console.log('Entrou na fetchimg');
  //   const url = `https://www.gravatar.com/avatar/${hash}`;
  //   const response = await fetch(url);
  //   const result = await response.json();
  //   console.log('resultado gravatar', result);
  //   this.setState({ gravatarHref: result });
  // };

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
