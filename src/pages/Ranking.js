import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Ranking extends React.Component {
  constructor() {
    super();
    this.state = {
      sortedRanking: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    const magicNum = (-1); // Ordenando o array em ordem decrescente:
    ranking.sort((a, b) => { // https://www.horadecodar.com.br/2021/01/11/como-ordenar-um-array-de-objetos-em-javascript/;
      if (a.score > b.score) {
        return magicNum;
      }
      return true;
    });
    this.setState({ sortedRanking: ranking, isLoading: false });
  }

  render() {
    const { sortedRanking, isLoading } = this.state;
    console.log('sortedRanking no render ===> ', sortedRanking);
    const { history } = this.props;
    return (
      <>
        <h1 data-testid="ranking-title">Ranking</h1>
        {
          isLoading
            ? <h2>Carregando</h2>
            : (
              sortedRanking.map((player, index) => (
                <div key={ index }>
                  <img src={ player.picture } alt="gravatar-img" />
                  <h3
                    data-testid={ `player-name-${[index]}` }
                  >
                    {player.name}
                  </h3>
                  <h4
                    data-testid={ `player-score-${[index]}` }
                  >
                    {player.score}
                  </h4>
                </div>
              )))
        }
        <button
          data-testid="btn-go-home"
          type="button"
          onClick={ () => history.push('/') }
        >
          Início
        </button>
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default connect()(Ranking);
