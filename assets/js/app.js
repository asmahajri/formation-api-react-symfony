import React, { useState } from "react";
import ReactDom from "react-dom";
import {
  HashRouter,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import "../css/app.css";

import "../bootstrap";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoot from "./components/PrivateRoot";


AuthAPI.setUp(); // verifier la connexion est valide ou non


// securiser la root si user coonecter afficher la page demandée sinon ridirection a la page login



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  ); // verifier si le user connecté ou non
  const NavBarWithRouter = withRouter(NavBar);
  const contextValue={
     isAuthenticated,
     setIsAuthenticated
  }
  return (
      <AuthContext.Provider value={contextValue}>
    <HashRouter>
      <NavBarWithRouter/>
      <main className="container pt-5">
        <Switch>
          <PrivateRoot path="/customers" component={CustomersPage} />
          <Route path="/login" component={LoginPage}/>
          <PrivateRoot path="/invoices" component={InvoicesPage}/>
          <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </HashRouter>
    </AuthContext.Provider>

  );

};

const rootElement = document.querySelector("#app");
ReactDom.render(<App />, rootElement);
