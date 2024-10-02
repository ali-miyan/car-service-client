import { ReactNode } from "react";

export interface InputProps {
  placeholder: string;
  width: string;
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ModalPopsCustom {
  isOpen: boolean;
  onClose: () => void;
  refetch?:()=>void;
  data?:string;
  servicePlace?:string
  id?:string;
  userId?:string;
}

export interface MainLayoutProps {
    children: ReactNode;
}

export interface ModalProps {
  open?:boolean;
  width?: number;
  height?: number;
  buttonLabel?: string;
  title?: string;
  children: React.ReactNode;
  disableClose?:boolean
  onClose?: () => void | undefined | void;
  packages?:object[]
}

export interface PlaceCard {
  title: string;
  subtitle: string;
  imageSrc: string;
  features: string[];
  style?: string;
  isDisabled?:boolean;
  handleNext?: () => void
}

export interface ButtonProps {
    children?: React.ReactNode;
    width?: string;
    height?: string;
    hoverColor?: string;
    bgColor?: string;
    onClick?: () => void;
}

export interface FormState {
  serviceName: string;
  description: string;
  logo: File | null;
  subServices: string[];
}
export interface serviceForm {
  terms: string;
  workImages: File | [];
  servicesPerDay?: string,
  subServices: string[];
}
export interface serviceForm {
  terms: string;
  workImages: File | [];
  servicesPerDay?: string,
  subServices: string[];
}

export interface IUserDetails {
  userId: string;
  username?: string;
  userImg?: string;
}

export interface ICompanyDetails {
  companyId: string;
  companyName?: string;
  companyImg?: string;
}

export interface IMessageData {
  _id?:string
  sender: string;
  content: any;
  timestamp: Date;
  type: "text" | "image" | "file";
}

export interface IChatData {
  _id?: string;
  user: IUserDetails;
  company: ICompanyDetails;
  messages: IMessageData[];
}


export interface LoadingButtonProps {
  isLoading: boolean;
  buttonText: string;
  color?:string;
  onClick?: any;
  width: string;
  height: string;
}

export const statusMessages: { [key: string]: string } = {
  "Booking Pending": "Your booking is in the queue and awaiting confirmation.",
  "Booking Confirmed": "Your booking has been confirmed. We will update you shortly.",
  "Driver Assigned": "A driver has been assigned to your booking.",
  "Driver En Route": "The driver is on their way to your location.",
  "Car Picked Up": "Your car has been picked up and is en route to the service center.",
  "Car Arrived at Service Center": "Your car has arrived at the service center.",
  "Service In Progress": "The service on your car is currently in progress.",
  "Service Completed": "The service on your car has been completed.",
  "Car En Route Back": "Your car is on its way back to you.",
  "Car Delivered": "Your car has been delivered back to you.",
  "Booking Completed": "Your booking process is complete. Thank you for choosing us!",
  "Ready for Pickup": "Your car is ready for pickup.",
  "Booking Cancelled": "You have cancelled your booking. If this was a mistake or if you need further assistance, please contact us."

};


export interface DeleteConfirmationModalProps {
  body: string;
  onConfirm: () => void;
  children: ReactNode;
}

export interface AddressData {
  address: string;
  city: string;
  streetRegion: string;
  postcode: string;
  country: string;
  latitude: string | number;
  longitude: string | number;
}

export interface Post {
  _id: string;
  ownerName: string;
  companyName: string;
  year: number;
  logo: string;
  contact1: number;
  contact2: number;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  address: AddressData;
  password: string;
  licenseImg: string;
  approvedImg: string;
  isBlocked: boolean;
  isApproved: "pending" | "accepted" | "declined";
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
