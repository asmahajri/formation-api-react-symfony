import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import moment from "moment";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const InvoicesPage = (props) => {
  const itemsPerPage = 30;
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const[loading,setLoading]=useState(true);

  const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger",
  };
  const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée",
  };

  // Récupération des invoices auprès de l'API
  const fetchInvoice = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Charger les invoices au chargement du composant
  useEffect(() => {
    fetchInvoice();
    setLoading(true);
  }, []); // utuliser cette methode cas en peut pas utiliser des async dans useEffect

  // Gestion de la suppression d'une facture
  const handleDelete = async (id) => {
    const originalInvoices = [...invoices]; // copie de tableau customers
    //1. approche optimiste //il cache le client avant la suppression probleme que en cas d'erreure le client va disparaitre mais le suppresion n'est pas fait rellement
    setInvoices(invoices.filter((invoice) => invoice.id != id));
    //2. approche pessimiste il cache le client apres la retour de repence mais le probleme qui est un peut lente

    //3. la soltion est le mixer les deux approche cacher le client avant la suppression puis en cas d'erreur retourne la copie de tableau cutomers
    try {
      await InvoicesAPI.delete(id); // en cas de success
      toast.success('La facture a bien été supprimée',{
        position:toast.POSITION.BOTTOM_RIGHT

      })
    } catch (error) {
      // en cas d'erreur
      setInvoices(originalInvoices);
      console.log(error.response);
      toast.error('erreur est servenue lors de la suppression de a facture')
    }
  };

  // Gestion de la recherche
  // avant refactorisation ...
  //const handleSearch = (event) => {
  //  const value = event.currentTarget.value;
  //  setSearch(value);
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value); // recuperer la valeur actuelle de l'input
    setCurrentPage(1); // tjrs commancer la rechreche a partir de 1ere page
  };

  // Filtrage des invoices en fonction de la recherche
  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  //pagination des données
  const paginatedInvoices = Pagination.getData(
    currentPage,
    itemsPerPage,
    filteredInvoices
  );

  // Gestion de format de date
  const formatDate = (str) => moment(str).format("DD/MM/yyy");

  return (
    <>
      <div className="from-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <h1>Liste des Factures {invoices.length}

      <Link to="/invoices/new" className="mb-3 btn btn-primary">Création Facture</Link>
      </h1>
      {!loading && <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Date d'envoi</th>
            <th>Status</th>
            <th>Chrono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => {
            return (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/customers/"+invoice.customer.id}>
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </Link>
                </td>
                <td>{invoice.amount.toLocaleString()} $</td>
                <td>{formatDate(invoice.sentAt)}</td>
                <td>
                  <span
                    className={"badge bg-" + STATUS_CLASSES[invoice.status]}
                  >
                    {STATUS_LABELS[invoice.status]}
                  </span>
                </td>
                <td>
                  <Link className="btn btn-primary" to={"/invoices/"+ invoice.id}>Edit</Link>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="btn btn-danger"
                  >
                    supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>|| <TableLoader />}

      {itemsPerPage < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default InvoicesPage;
