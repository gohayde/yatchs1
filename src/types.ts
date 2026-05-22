export interface Yacht {
  id: string;
  name: string;
  brand: 'SANLORENZO' | 'PRINCESS' | 'CRANCHI';
  loa: string;
  beam: string;
  speed: string;
  engines: string;
  status: 'IN STOCK' | 'PRICE ON REQUEST' | string;
  price: string;
  image: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
}

export interface SubscriptionInput {
  email: string;
}
