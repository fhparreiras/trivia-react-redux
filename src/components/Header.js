import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      gravatarHref: '',
    };
    this.fetchGravataImg = this.fetchGravataImg.bind(this);
  }

  componentDidMount() {
    this.fetchGravataImg();
  }

  fetchGravataImg = () => {
    //   async fetchGravataImg() {
    const { gravatarEmail } = this.props;
    const hash = md5(gravatarEmail).toString();
    const url = `https://www.gravatar.com/avatar/${hash}`;
    // const response = await fetch(url);
    // const result = await response.url;
    this.setState({ gravatarHref: url });
    // return result;
  }

  render() {
    const { name, score } = this.props;
    const { gravatarHref } = this.state;
    return (
      <header>
        <h1>TrybeTrivia</h1>
        <img
          src={ gravatarHref }
          alt={ gravatarHref }
          data-testid="header-profile-picture"
        />
        <span data-testid="header-player-name">{name}</span>
        <span data-testid="header-score">{score}</span>
      </header>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
};

// md5('fhparreiras@gmail.com').toString()

const mapStateToProps = (state) => ({
  name: state.player.name,
  gravatarEmail: state.player.gravatarEmail,
  score: state.player.score,
});

export default connect(mapStateToProps, null)(Header);
