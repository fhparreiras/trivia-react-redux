import React from 'react';
import { connect } from 'react-redux';
import '../App.css';
import PropTypes from 'prop-types';

function Questions(questions) {
  console.log(questions);
  return (
    {
        questions.map((question) => (

        ))
    }
  );
}

Questions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect()(Questions);


{/* <div key={ questions }>
      <h2 data-testid="question-category">
        {questions}
      </h2>
      <h3 data-testid="question-text">{questions}</h3>
    </div> */}