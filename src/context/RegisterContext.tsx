import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FormData {
  ownerName?: string;
  companyName?: string;
  year?: string;
  description?: string;
  logoImg?: any;
  contact1?: number | string;
  contact2?: number | string;
  email?: string;
  licenseNumber?: number | string;
  licenseExpiry?: number | string;
  licenseImg?: any;
  approvedImg?: any;
  password?: string;
  confirmPassword?: string;
  location?: string;
  address?: any;
}

interface FormErrors {
  ownerName?: string;
  companyName?: string;
  year?: string;
  description?: string;
  logoImg?: string;
  contact1?: string;
  contact2?: string;
  email?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  licenseImg?: string;
  approvedImg?: string;
  password?: string;
  confirmPassword?: string;
  location?: string;
}

interface FormContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

const defaultFormData: FormData = {
  ownerName: "",
  companyName: "",
  year: "",
  description: "",
  logoImg: undefined,
  contact1: "",
  contact2: "",
  email: "",
  licenseNumber: "",
  licenseExpiry: "",
  licenseImg: undefined,
  approvedImg: undefined,
  location: "",
  password: "",
  confirmPassword: "",
  address: {},
};

const defaultFormErrors: FormErrors = {
  ownerName: "",
  companyName: "",
  year: "",
  description: "",
  logoImg: "",
  contact1: "",
  contact2: "",
  email: "",
  licenseNumber: "",
  licenseExpiry: "",
  licenseImg: "",
  approvedImg: "",
  confirmPassword: "",
  password: "",
  location: "",
};

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>(defaultFormErrors);

  return (
    <FormContext.Provider value={{ formData, setFormData, errors, setErrors }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
