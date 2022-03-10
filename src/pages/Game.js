import React from 'react';
import { connect } from 'react-redux';
import '../App.css';

class Game extends React.Component {
  render() {
    return (
      <div>
        <span>.</span>
      </div>
    );
  }
}

export default connect()(Game);
