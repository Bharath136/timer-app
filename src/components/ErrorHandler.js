import axios from "axios";
import { Alert, ToastAndroid, Platform } from "react-native";

const showToast = (message) => {
    if (Platform.OS === "android") {
        // ToastAndroid.show(message, ToastAndroid.LONG);
        Alert.alert("Error", message);
    } else {
        Alert.alert("Error", message);
    }
};

const handleAxiosError = (error) => {
    if (!axios.isAxiosError(error)) {
        return "An unexpected error occurred. Please try again later.";
    }

    if (error.code === "ERR_NETWORK") {
        return "Network error. Please check your internet connection and try again.";
    }

    if (!error.response) {
        return "The server did not respond. Please try again later.";
    }

    // Handle specific status codes
    switch (error.response.status) {
        case 400:
            return error.response.data.message || "Bad Request. Please check your input.";
        case 401:
            return "Unauthorized access. Please check your credentials.";
        case 403:
            return error.response.data.message || "Access forbidden. Contact support if needed.";
        case 404:
            return error.response.data.message || "Resource not found.";
        case 429:
            return "Too many requests. Please wait and try again later.";
        case 500:
            return "Internal server error. Please try again later.";
        default:
            return error.response.data.message || "An unknown error occurred. Please try again.";
    }
};

// Unified error handler for POST requests
export const postErrorHandler = (error, setErrorMessage = () => { }) => {
    const errorMessage = handleAxiosError(error);
    setErrorMessage(errorMessage);
    showToast(errorMessage);
    return errorMessage;
};

// Unified error handler for GET requests
export const getErrorHandler = (error, setErrorMessage = () => { }) => {
    const errorMessage = handleAxiosError(error);
    setErrorMessage(errorMessage);
    showToast(errorMessage);
    return errorMessage;
};

// Axios interceptor for global error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = handleAxiosError(error);
        showToast(errorMessage);
        return Promise.reject(error);
    }
);







