import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Default toast configuration
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: true,
};

// Custom styles for different toast types
const toastStyles = {
  success: {
    style: {
      background: "#E0F6FF",
      borderLeft: "4px solid #0075BC", // Primary blue color
      color: "#004A76", // Text color
      fontFamily: "Outfit, sans-serif",
      borderRadius: "8px",
      padding: "16px 20px",
      boxShadow: "0 4px 12px rgba(0, 117, 188, 0.15)",
      fontSize: "16px",
      fontWeight: "500",
      border: "1px solid rgba(0, 117, 188, 0.2)",
    },
  },
  error: {
    style: {
      background: "#FFE0E0",
      borderLeft: "4px solid #BF0000",
      color: "#BF0000",
      fontFamily: "Outfit, sans-serif",
      borderRadius: "8px",
      padding: "16px 20px",
      boxShadow: "0 4px 12px rgba(191, 0, 0, 0.15)",
      fontSize: "16px",
      fontWeight: "500",
      border: "1px solid rgba(191, 0, 0, 0.2)",
    },
  },
  warning: {
    style: {
      background: "#FFF4E0",
      borderLeft: "4px solid #F4A261",
      color: "#F4A261",
      fontFamily: "Outfit, sans-serif",
      borderRadius: "8px",
      padding: "16px 20px",
      boxShadow: "0 4px 12px rgba(244, 162, 97, 0.15)",
      fontSize: "16px",
      fontWeight: "500",
      border: "1px solid rgba(244, 162, 97, 0.2)",
    },
  },
  info: {
    style: {
      background: "#E0F7FF",
      borderLeft: "4px solid #2AB7CA",
      color: "#2AB7CA",
      fontFamily: "Outfit, sans-serif",
      borderRadius: "8px",
      padding: "16px 20px",
      boxShadow: "0 4px 12px rgba(42, 183, 202, 0.15)",
      fontSize: "16px",
      fontWeight: "500",
      border: "1px solid rgba(42, 183, 202, 0.2)",
    },
  },
};

// Custom toast functions
export const showToast = {
  success: (message) =>
    toast.success(message, {
      ...defaultOptions,
      style: toastStyles.success.style,
    }),

  error: (message) =>
    toast.error(message, {
      ...defaultOptions,
      style: toastStyles.error.style,
    }),

  warning: (message) =>
    toast.warning(message, {
      ...defaultOptions,
      style: toastStyles.warning.style,
    }),

  info: (message) =>
    toast.info(message, {
      ...defaultOptions,
      style: toastStyles.info.style,
    }),

  // Custom loading toast with promise
  promise: (promise, loadingMessage, successMessage, errorMessage) =>
    toast.promise(
      promise,
      {
        pending: {
          render: `${loadingMessage}`,
          style: {
            background: "#E0F7FF",
            borderLeft: "4px solid #2AB7CA",
            color: "#086F7A",
            fontFamily: "Outfit, sans-serif",
            borderRadius: "8px",
            padding: "16px 20px",
            boxShadow: "0 4px 12px rgba(42, 183, 202, 0.15)",
            fontSize: "16px",
            fontWeight: "500",
            border: "1px solid rgba(42, 183, 202, 0.2)",
          },
        },
        success: {
          render: successMessage,
          style: toastStyles.success.style,
        },
        error: {
          render: errorMessage,
          style: toastStyles.error.style,
        },
      },
      {
        ...defaultOptions,
        autoClose: 4000,
      }
    ),
};

// Usage example:
// import { showToast } from '../config/toastConfig';
// showToast.success('Operation completed successfully!');
// showToast.error('Something went wrong!');
// showToast.warning('Please check your input!');
// showToast.info('Please wait while we process your request...');
// showToast.promise(
//   apiCall(),
//   'Loading...',
//   'Success!',
//   'Error occurred!'
// );
