export interface Product {
  id: string;
  name: string;
  category: "FRUIT" | "TEXTILE";
  story: string;
  price: number;
  imageUrl: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  startDate: Date;
  maxPeople: number;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  items: Product[] | Tour[]; 
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}