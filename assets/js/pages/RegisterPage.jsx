import Axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import RegisterAPI from "../services/RegisterAPI";
import { toast } from 'react-toastify';



const RegisterPage =(props)=>{

    const [user,setUser]= useState({
         firstName:"",
         lastName:"",
         email:"",
         password:"",
        passwordConfirm:""
    })

    const [errors,setError]= useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
       passwordConfirm:""
   })

  // gestion des changements des inputs dans le formulaire  
  const handleChange=({currentTarget})=>{
    const {name,value}=currentTarget;
    setUser({...user,[name]:value});
  }


  const handleSubmit= async event =>{

event.preventDefault();

try{

    await RegisterAPI.register(user);
    toast.success('Vous été désormais inscrit , vous pouvez vous connecter')

}catch({response}){
    const {violations}=response.data;
    if(violations){
        const apiErrors={};
        violations.map(({propertyPath,message})=>{

            apiErrors[propertyPath]=message;
        })
         setError(apiErrors);
    }
 toast.error('Des errures dans votre formulaire')

}

}
return(
 <>
  <h1>Inscription</h1>
  <form onSubmit={handleSubmit}>
 <Field name="firstName"  label="Nom" type="text" onChange={handleChange} placeholder="Nom d'utilisateur" value={user.firstName} error={errors.firstName} />
 <Field name="lastName"  label="Prenom" type="text" onChange={handleChange} placeholder="Prenom d'utilisateur" value={user.lastName} error={errors.lastName} />
 <Field name="email"  label="Adresse email" type="email" onChange={handleChange} placeholder="Email d'utilisateur" value={user.email} error={errors.email} />
 <Field name="password"  label="Mot de passe" type="password" onChange={handleChange} placeholder="Mot de passe d'utilisateur" value={user.password} error={errors.password} />
 <Field name="passwordConfirm"  label="Confirmation de Mot de passe" type="password" onChange={handleChange} placeholder="Confirmation de Mot de passe d'utilisateur" value={user.passwordConfirm} error={errors.passwordConfirm} />

  <button className="btn btn-primary">Enregistrer</button>
  </form>
  <Link to="/login">j'ai déja un compte</Link>

 </>

);


}

export default RegisterPage;