import axios from "axios";
import React ,{useEffect,useState} from "react";
import Pagination from "../components/Pagination";



const CustomersPageWithAPIPagination = (props) => {
    
    const[customers,setCustomers]=useState([]);
    const [currentPage,setCurrentPage]=useState(1);
    const [totalItems,setTotalItems]=useState(0);
    const[loading,setLoading]=useState(true);
    const itemsPerPage=10;




    // affichage de liste des clients lors de chargement de la page 
    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
        .then(response=>{+
            setCustomers(response.data["hydra:member"]);
            setTotalItems(response.data["hydra:totalItems"]);
            setLoading(false);
        
        }
            
            )
       .catch(error=>console.log(error.response));
        },[currentPage]);

        // suppression d'un client

        const handleDelete=id=>{
          const originalCustomers=[...customers];// copie de tableau customers
            //1. approche optimiste //il cache le client avant la suppression probleme que en cas d'erreure le client va disparaitre mais le suppresion n'est pas fait rellement
            setCustomers(customers.filter(customer=>customer.id!=id)); 
           //2. approche pessimiste il cache le client apres la retour de repence mais le probleme qui est un peut lente  
           

           //3. la soltion est le mixer les deux approche cacher le client avant la suppression puis en cas d'erreur retourne la copie de tableau cutomers
         
           axios.delete("http://127.0.0.1:8000/api/customers/"+id)
          .then(response=>console.log("ok")).catch(error=>{
              setCustomers(originalCustomers)
              console.log(error.response)
            })

        }
  
    
    const handlePageChange=(page)=>{
        setLoading(true);
        setCurrentPage(page);
    }


    return (<> 
            <h1>Liste des clients Pagination</h1>
           
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
                       {loading && (<tr><td>chargement...</td></tr>)}
                    {!loading && customers.map((customer)=>{
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
    

        <Pagination
         currentPage={currentPage} 
         itemsPerPage={itemsPerPage}
         length={totalItems}
         onPageChanged={handlePageChange}
          />
           
            </>
        
        
        
        
        );
               
}
 
export default CustomersPageWithAPIPagination;