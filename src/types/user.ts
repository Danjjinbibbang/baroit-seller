export interface AddressRequest {
  name: string;
  recipient: string;
  postalCode: string;
  address1: string;
  address2: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface User {
  ownerId: string;
}
