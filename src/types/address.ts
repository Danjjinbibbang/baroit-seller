export interface Address {
  addressId: number;
  alias: string;
  isDefault: boolean;
  receiverName: string;
  receiverPhone: string;
  zipcode: string;
  road: string;
  jibun: string;
  detailed: string;
  latitude: number;
  longitude: number;
  riderMessage: string | null;
  entrancePassword: string | null;
  deliveryGuideMessage: string;
}

export interface AddressFormData {
  detailed: string;
  alias: string;
  riderMessage: string | null;
  entrancePassword: string | null;
  deliveryGuideMessage: string;
  road?: string;
  jibun?: string;
  latitude?: number;
  longitude?: number;
}

export type AddressResponse = {
  customerId: number;
  addresses: Address[];
};
