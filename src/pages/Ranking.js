import React from 'react';
import { connect } from 'react-redux';

class Ranking extends React.Component {
  render() {
    return (
      <h1 data-testid="ranking-title">Ranking</h1>
    );
  }
}

export default connect()(Ranking);
