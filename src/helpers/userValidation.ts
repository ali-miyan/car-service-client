import { emailRegex, phoneRegex } from "../constants/regex";

export const validateInput = (name: string, value: any | undefined) => {
  let error = "";
  switch (name) {
    case "ownerName":
      if (!value) {
        error = "ownername is required";
      } else if (value.length < 3) {
        error = "At least 3 characters";
      }
      break;
    case "companyName":
      if (!value) {
        error = "Company name is required";
      } else if (value.length < 3) {
        error = "At least 3 characters";
      }
      break;
    case "serviceName":
      if (!value) {
        error = "servicename is required";
      } else if (value.length < 3) {
        error = "At least 3 characters";
      }
      break;
    case "year":
      if (!value) {
        error = "Year is required";
      } else if (value.length < 3) {
        error = "At least 3 characters";
      }
      break;
    case "description":
      if (!value) {
        error = "description is required";
      } else if (value.length < 3) {
        error = "At least 3 characters";
      }
      break;
    case "servicesPerDay":
      if (!value) {
        error = "services per day is required";
      }
      break;
    case "username":
      if (!value) {
        error = "Username is required";
      } else if (value.length < 3) {
        error = "At least 3 characters";
      }
      break;
    case "email":
      if (!value) {
        error = "Email is required";
      } else if (!emailRegex.test(value)) {
        error = "Email is not valid";
      }
      break;
    case "phone":
      if (!value) {
        error = "Phone number is required";
      } else if (!phoneRegex.test(value)) {
        error = "Phone number is not valid";
      }
      break;
    case "password":
      if (!value) {
        error = "Password is required";
      } else if (value.length < 10) {
        error = "At least 10 characters long";
      }
      break;
    case "newPassword":
      if (!value) {
        error = "new password is required";
      } else if (value.length < 10) {
        error = "At least 10 characters long";
      }
      break;
    case "contact1":
      if (!value) {
        error = "contact-1 is required";
      } else if (value.length !== 10) {
        error = "Contact-1 must be 10";
      }
      break;
    case "contact2":
      if (!value) {
        error = "contact-2 is required";
      } else if (value.length !== 10) {
        error = "Contact-2 must be 10";
      }
      break;
    case "licenseNumber":
      if (!value) {
        error = "license number is required";
      } else if (value.length !== 12) {
        error = "license number 12";
      }
      break;
    case "licenseExpiry":
      if (!value) {
        error = "license Expiry Date is required";
      }
      break;
    case "confirmPassword":
      if (!value) {
        error = "confirm password is required";
      } else if (value.length < 10) {
        error = "At least 10 characters long";
      }
      break;
    case "vin":
      if (!value) {
        error = "number is required";
      }
      break;
    case "address":
      if (!value) {
        error = "address is required";
      }
      break;
    case "color":
      if (!value) {
        error = "color is required";
      }
      break;
    case "selectedService":
      if (!value) {
        error = "select a service";
      }
      break;
    case "selecetedHours":
      if (!value) {
        error = "select a hour";
      }
      break;
    case "servicePlace":
      if (!value) {
        error = "please select a place";
      }
      break;
    case "experience":
      if (!value) {
        error = "experience is required";
      }
      break;
    case "workingHours":
      if (!value) {
        error = "workingHours is required";
      }
      break;
    case "termsAndConditions":
      if (!value) {
        error = "termsAndConditions is required";
      }
      break;
    case "latitude":
      if (!value) {
        error = "latitude is required";
      }
      break;
    case "longitude":
      if (!value) {
        error = "longitude is required";
      }
      break;
    case "city":
      if (!value) {
        error = "city is required";
      }
      break;
    case "streetRegion":
      if (!value) {
        error = "street/region is required";
      }
      break;
    case "postcode":
      if (!value) {
        error = "postcode is required";
      }
      break;
    case "terms":
      if (!value) {
        error = "terms is required";
      }
      break;
    case "country":
      if (!value) {
        error = "country is required";
      }
      break;
    default:
      break;
  }
  return error;
};

interface FormErrors {
  username?: string;
  email: string;
  phone?: string;
  password: string;
  global?: string;
}

export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some((error) => error !== "");
};

export const isFormEmpty = (formData: Record<string, string>): boolean => {
  return Object.values(formData).some((field) => field === "");
};
