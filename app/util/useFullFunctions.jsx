import moment from "moment";

const formatDate = (dateString) => {
  const inputFormat = "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ";

  moment.locale("fr");

  return moment
    .utc(dateString, inputFormat, true)
    .format("D MMMM YYYY [at] HH:mm:ss");
};
const orderStatusTextDisplayer = (status, type) => {
  switch (status?.toString()) {
    case "0":
      return "Order Placed";
    case "1":
      return "Preparing your order";
    case "2":
      return type?.toString() == 'pickup' ? "Ready for Pickup" : "Order on the way to address";
    case "3":
      return type?.toString() == 'pickup' ? "Picked up" : "Delivered";
    case "10":
      return "Fully paid";
    default:
      return "Order Placed";
  }
};

export { formatDate, orderStatusTextDisplayer };
