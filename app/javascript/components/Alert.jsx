import Swal from "sweetalert2";

const showAlert = (title, message, icon, type) => {
  if (type === "delete" || type === "logout") {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: type === "delete" ? "Yes, delete it!" : "Yes, logout!",
    });
  }
  else if (type === "question") {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, discard it!",
    });
  }

  else {
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

export default showAlert;
