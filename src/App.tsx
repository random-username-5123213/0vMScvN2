import React from 'react';
import CommentComponent from './Comment';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Comment App</h1>
      <h2>Created by: Jakub Pinkowski</h2>
      <CommentComponent />
    </div>
  );
};

export default App;
