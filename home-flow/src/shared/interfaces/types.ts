export interface User {
  userId: string;
  username: string;
  token: string;
}

export interface Object {
  _id: string;
  name: string;
  userId: string;
  meters: Meter[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Meter {
  _id?: string;
  name: string;
  unit: string;
  type: "electricity" | "water" | "gas" | "other";
  rate?: number;
  hasSewage?: boolean;
  sewageRate?: number;
}

export interface Indication {
  _id: string;
  date: string;
  objectId: string;
  values: {
    meterId: string;
    value: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Consumption {
  meterId: string;
  meterName: string;
  consumption: number;
  rate: number;
  cost: number;
  sewage?: {
    consumption: number;
    rate: number;
    cost: number;
  };
}

export interface TotalPayment {
  total: number;
  details: Consumption[];
}

export interface Form {
  username: string;
  password: string;
}
