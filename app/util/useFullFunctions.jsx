import moment from "moment";

const formatDate = (dateString) => {
  const inputFormat = "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ";
  const outputFormat = "D-MM-YYYY - HH:mm:ss";

  // Create moment instance with English locale without changing global locale
  const date = moment(dateString, inputFormat);

  return date.format(outputFormat);
};

const orderStatusTextDisplayer = (status, type) => {
  switch (status?.toString()) {
    case "-2":
      return "Commande annulée par le magasin";
    case "-1":
      return "Commande annulée par le client";
    case "0":
      return "Commande passée";
    case "1":
      return "Préparation de votre commande";
    case "2":
      return type?.toString() === "pickup"
        ? "Prêt pour le retrait"
        : "Commande en route vers l'adresse";
    case "3":
      return type?.toString() === "pickup" ? "Retirée" : "Livrée";
    case "4":
      return "Commande retournée";
    case "10":
      return "Entièrement payée";
    default:
      return "Commande passée";
  }
};

// Add a default export to satisfy the .jsx requirement
const UtilityFunctions = {
  formatDate,
  orderStatusTextDisplayer,
};

const formatNumber = (num) => {
  if (num == null) return "0.00";
  return num.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default UtilityFunctions;
export { formatDate, orderStatusTextDisplayer, formatNumber };
