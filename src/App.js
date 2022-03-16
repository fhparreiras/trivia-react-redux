import React from 'react';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import Feedback from './pages/Feedback';
import Game from './pages/Game';
import Settings from './pages/Settings';
import Ranking from './pages/Ranking';
import './App.css';

export default function App() {
  return (
    <>
      <Route exact path="/" component={ Login } />
      <Route path="/game" component={ Game } />
      <Route path="/configuracoes" component={ Settings } />
      <Route path="/feedback" component={ Feedback } />
      <Route path="/ranking" component={ Ranking } />
    </>
  );
}
