import axios from "axios";
import React ,{useEffect,useState} from "react";
import { async } from "regenerator-runtime";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";



const CustomersPage = (props) => {
    
    const itemsPerPage=10;
    
    const[customers,setCustomers]=useState([]);
    const [currentPage,setCurrentPage]=useState(1);
    const [search, setSearch]=useState('');


    const fetchCustomer =async()=>{
       try{
        const data=await CustomersAPI.findAll();
        console.log(data)
        setCustomers(data);
       }catch(error){
        console.log(error.response)
       }
    }

    // affichage de liste des clients lors de chargement de la page 
        useEffect(()=>{fetchCustomer()},[]); // utuliser cette methode cas en peut pas utiliser des async dans useEffect

        // suppression d'un client

        const handleDelete=async (id)=>{
          const originalCustomers=[...customers];// copie de tableau customers
            //1. approche optimiste //il cache le client avant la suppression probleme que en cas d'erreure le client va disparaitre mais le suppresion n'est pas fait rellement
            setCustomers(customers.filter(customer=>customer.id!=id)); 
           //2. approche pessimiste il cache le client apres la retour de repence mais le probleme qui est un peut lente  
           

           //3. la soltion est le mixer les deux approche cacher le client avant la suppression puis en cas d'erreur retourne la copie de tableau cutomers
         try{
           await CustomersAPI.delete(id); // en cas de success
         }catch(error){
             // en cas d'erreur
            setCustomers(originalCustomers)
            console.log(error.response)
         }
        
        }
        

        const filteredCustomers = customers.filter(
            (c) =>
              c.firstName.toLowerCase().includes(search.toLowerCase()) ||
              c.lastName.toLowerCase().includes(search.toLowerCase()) ||
              c.email.toLowerCase().includes(search.toLowerCase()) ||
              (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
          );
    
    const handlePageChange=(page)=> setCurrentPage(page);
    const paginatedCustomers=Pagination.getData(currentPage,itemsPerPage,filteredCustomers);

  const handleSearch=({currentTarget})=>{
     setSearch(currentTarget.value);// recuperer la valeur actuelle de l'input
     setCurrentPage(1);// tjrs commancer la rechreche a partir de 1ere page 
  }



    return (<> 
       <div className="from-group">
           <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..." />
       </div>

            <h1>Liste des clients {customers.length}</h1>
           
            <table className="table table-hover">
               <thead>
                   <tr>
                       <th>Id</th>
                       <th>Client</th>
                       <th>Email</th>
                       <th>Entreprise</th>
                       <th>Factures</th>
                       <th>Montant Total</th>
                       <th></th>
                   </tr>
                   </thead>
                   <tbody>
                    {paginatedCustomers.map((customer)=>{
                        return(
                         <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                             <td>{customer.invoices.length}</td>
                             <td>{customer.totalAmount.toLocaleString()} $</td>
                             <td><button onClick={()=>handleDelete(customer.id)} disabled={customer.invoices.length>0} className="btn btn-danger">supprimer</button></td>
                         </tr>
                        )

                    })}
                      
                   </tbody>

            </table>
    

        {itemsPerPage<filteredCustomers.length && <Pagination
         currentPage={currentPage} 
         itemsPerPage={itemsPerPage}
         length={filteredCustomers.length}
         onPageChanged={handlePageChange}
          />
        }
           
            </>
        
        
        
        
        );
               
}
 
export default CustomersPage;