import React from 'react';
import { connect } from 'react-redux';
import logo from '../trivia.png';
import '../App.css';

class Login extends React.Component {
  state = {
    inputName: '',
    inputEmail: '',
    isButtonDisabled: true,
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

  render() {
    const { inputEmail, inputName, isButtonDisabled } = this.state;
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
            onClick={ this.onButtonClick }
          >
            Play
          </button>
        </form>
      </header>
    );
  }
}

export default connect()(Login);
