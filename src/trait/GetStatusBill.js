export const getStatusBill = (status) => {
  let message = "";
  switch (status) {
    case 0:
      message = "Processing";
      break;
    case 1:
      message = "In Transit";
      break;
    case 2:
      message = "Delivered";
      break;
  }
  return message;
};
