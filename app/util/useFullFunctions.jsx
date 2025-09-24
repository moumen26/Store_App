import moment from "moment";

const formatDate = (dateString) => {
  const inputFormat = "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ";
  const outputFormat = "D-MM-YYYY - HH:mm:ss";

  // Create moment instance with English locale without changing global locale
  const date = moment(dateString, inputFormat);

  return date.format(outputFormat);
};

function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  
  // Handle string timestamps
  const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  
  if (isNaN(numericTimestamp)) return "Invalid Date";
  
  const date = new Date(numericTimestamp);
  
  if (isNaN(date.getTime())) return "Invalid Date";
  
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}-${month}-${year} - ${hours}:${minutes}:${seconds}`;
}

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
  formatTimestamp
};

const formatNumber = (num) => {
  if (num == null) return "0.00";
  return num.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default UtilityFunctions;
export { formatDate, orderStatusTextDisplayer, formatNumber, formatTimestamp };
