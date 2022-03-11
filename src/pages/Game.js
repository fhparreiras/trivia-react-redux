import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import Header from '../components/Header';

class Game extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <span>.</span>
      </div>
    );
  }
}

export default connect()(Game);
