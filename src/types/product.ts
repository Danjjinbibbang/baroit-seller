export interface ProductOption {
  optionName: string;
  optionValues: string[];
  prices: number[];
  salePrices: number[];
  stocks: number[];
}

export interface Product {
  id: string;
  name: string;
  status: string;
  stock: string;
  stockManagement: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  unit: string;
  deliveryType: string;
  updatedAt: string;
  createdAt: string;
  category: string;
  storeCategory: string;
  saleStartDate: string;
  saleEndDate: string;
  optionType: "단일" | "옵션";
  options: ProductOption[];
  image: string;
  description: string;
  minorPurchase: boolean;
}
