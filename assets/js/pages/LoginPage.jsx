import Axios from "axios";
import React,{useState,useEffect,useContext} from "react";
import axios from "axios";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";


const LoginPage= ({history}) => {
  const {setIsAuthenticated}=useContext(AuthContext);

    
const [credentials, setCredentials]=useState(
    {
    username:"",
    password:""
    })
const [error,setError]=useState('');


// Gestion des champs
    const handleChange=({currentTarget})=>{
        const {value,name}=currentTarget;
       setCredentials({...credentials,[name]:value}); // faire une copie de credentials puis recherche par name puis rempir le tableau par le valeur

    }

    // gestion de submit
    const handleSubmit= async event=>{
        event.preventDefault();
        try{
          await AuthAPI.autenticate(credentials);
          setIsAuthenticated(true);
          history.replace("/customers");
          setError("");
        }catch(error){
           setError("aucun compte ne possed cette adresse email ou alors les informations ne correspondent pas !");
        }
    }

    return (<>
               <h1 className="text-center">Connexion a l'application</h1>
               <form  className="form-group" onSubmit={handleSubmit}>

                 <label htmlFor="email">Email</label>
                 <input type="email" value={credentials.username} onChange={handleChange} className={"form-control" + (error && " is-invalid")} name="username" id="username" placeholder="Email"/>
                  <p className="invalid-feedback">{error}</p>
                 <label htmlFor="password">Mot de passe</label>
                 <input type="password" value={credentials.password} onChange={handleChange} className="form-control" name="password" id="password" placeholder="Mot de passe"/>
               
                 <div className="form-group">
                     <button className="btn btn-success">Connexion</button>
                 </div>
               </form>
    
    
    
         </>  );
}
 
export default LoginPage