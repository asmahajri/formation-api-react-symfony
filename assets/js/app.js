
import React from "react";
import ReactDom from "react-dom";
import { HashRouter,Switch,Route } from "react-router-dom"


import '../css/app.css';

import '../bootstrap';
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";


const App=()=>{

    return <HashRouter> <NavBar />
    <main className="container pt-5">
        <Switch>
           <Route path="/customers" component={CustomersPage}/> 
           <Route path="/invoices" component={InvoicesPage}/> 
           <Route path="/" component={HomePage}/>

        </Switch>

    </main>
    </HashRouter>
}

const rootElement= document.querySelector('#app');
ReactDom.render(<App />,rootElement);



