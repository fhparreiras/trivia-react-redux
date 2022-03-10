import React from 'react';
// import md5 from 'crypto-js/md5'; importacao do md5 para transformar email em hash
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchToken } from '../actions';
import logo from '../trivia.png';
import '../App.css';

class Login extends React.Component {
  state = {
    inputName: '',
    inputEmail: '',
    isButtonDisabled: true,
    isLogin: false,
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    }, this.handleButton);
  }

  handleButton = () => {
    const { inputEmail, inputName, isButtonDisabled } = this.state;
    const minLength = 1;
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    return inputName.length >= minLength
    && emailRegex.test(inputEmail)
      ? this.setState({ isButtonDisabled: !isButtonDisabled })
      : this.setState({ isButtonDisabled: true });
  }

  handleButtonClick = async (event) => {
    const { fetchToken } = this.props;
    event.preventDefault();
    await fetchToken();
    this.setState({
      isLogin: true,
    });
  }

  render() {
    const { inputEmail, inputName, isButtonDisabled, isLogin } = this.state;
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
            type="submit"
            className="btn-login"
            data-testid="btn-play"
            disabled={ isButtonDisabled }
            onClick={ this.handleButtonClick }
          >
            Play
          </button>
          { isLogin && <Redirect to="/game" />}
        </form>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchToken: () => dispatch(fetchToken()) });

export default connect(mapStateToProps, mapDispatchToProps)(Login);
