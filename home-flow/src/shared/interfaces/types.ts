export interface User {
  token: string;
  userId: string;
  username: string;
}

export interface Object {
  _id: string;
  name: string;
  userId: number;
}

export interface Item {
  _id: string;
  date: string;
  el: number;
  water: number;
}

export interface Form {
  username: string;
  password: string;
}
