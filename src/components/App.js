import React from 'react';
import react, { useState } from "react";
import AppRouter from './Router';

function App() {
  const [isLoggedIn, setIsLoggerIn] = useState(false);
  return <AppRouter isLoggedIn={isLoggedIn} />;
}

export default App;
