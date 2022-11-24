import Axios from "axios";
import React,{useState,useEffect,useContext} from "react";
import axios from "axios";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";


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
          setError("");
          history.replace("/customers");
          toast.success('Vous étes désormais connecté !')
        }catch(error){
           setError("aucun compte ne possed cette adresse email ou alors les informations ne correspondent pas !");
           toast.error("une erreur est survenue");
          }
    }

    return (<>
               <h1 className="text-center">Connexion a l'application</h1>
               <form  className="form-group" onSubmit={handleSubmit}>

                  <Field name="username" label="Email" value={credentials.username} onChange={handleChange} placeholder="Email" type="email" error={error}/>
                  <Field name="password" label="Mot de passe" value={credentials.password} onChange={handleChange}  type="password" />
              
                 <div className="form-group">
                     <button className="btn btn-success">Connexion</button>
                 </div>
               </form>
    
    
    
         </>  );
}
 
export default LoginPage