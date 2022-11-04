import axios from "axios";
import jwtDecode from "jwt-decode";

// Deconnexion (suppressionde token de local storage et axios)

function logout(){

    window.localStorage.removeItem("authToken");

    delete axios.defaults.headers["Authorization"];
}
// requete HTTP d'authentification et stockage de token dans local storage et sur axios
function autenticate(credentials){

    return axios.post("http://127.0.0.1:8000/api/login_check",credentials)
    .then(response=>response.data.token).
    then(token=>{
     window.localStorage.setItem("authToken",token);// stoker le token dans local storage de serveur
     setAxiosToken(token);
     // On prévient Axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
   
    })
}
// positioner le token JWT sur axios
function  setAxiosToken(token){

    axios.defaults.headers["Authorization"]="Bearer " +token;// modifier le header de requette pour ajouter dans l'attribut Autorization le token pour autorisé l'acces aux info de l'aaplication

}

// verifier si le token est valide n'est expiré dans ce cas autoriser l'acces
//mise en place lors de chargement de l'application
function setUp(){

   const token = window.localStorage.getItem("authToken");
   if(token){
    const {exp:expiration}=jwtDecode(token);
     if(expiration*1000>new Date().getTime()){
        setAxiosToken(token);
        console.log('connextion est etablie ');
     }

   }

}
/**
 * permet de savoir si on est authentifié au pas
 *  
 */
function isAuthenticated(){

    const token = window.localStorage.getItem("authToken");
    if(token){
     const {exp:expiration}=jwtDecode(token);
      if(expiration*1000>new Date().getTime()){
         return true;
      }
      return false;
 
    }
    return false;
}

export default{
    autenticate,
    logout,
    setUp,
    isAuthenticated

}