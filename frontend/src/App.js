import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Auth/Login';
import TestEmpresa from './components/Empresas/TestEmpresa';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  return (
    <Route
      {...rest}
      render = {(props) =>
        token ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/empresas" component={TestEmpresa} />
      </Switch>
    </Router>
  );
}

export default App;
