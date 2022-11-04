import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const PrivateRoot = ({ path, component}) =>{

    const {isAuthenticated}=useContext(AuthContext);
    
      return (isAuthenticated ? (
        <Route
          path={path}
          component={component}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <Redirect to="/login" />
      ));
    }

 export default PrivateRoot;   