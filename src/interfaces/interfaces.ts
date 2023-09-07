export interface IUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
}

export interface IItem {
  id: string;
  name: string;
  description: string | null;
  author: string | null;
  price: number;
  discount: number | null;
  category: string | null;
  tags: string[];
  quantity: number;
  availability: boolean;
  images: string[];
  reviews: IReview[];
}

export interface ICartItem {
  id: string;
  cartId: string;
  item: IItem;
  itemId: string;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICart {
  id: string;
  userId: string;
  totalItemsCount: number | null;
  totalPrice: number | null;
  createdAt: Date;
  updatedAt: Date;
  cartItems: ICartItem[];
  isCheckedOut: boolean;
}

export interface IPurchasedItem {
  id: string;
  userId: string;
  item: IItem;
  itemId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  id: string;
  user: IUser;
  userId: string;
  // item: IItem;
  itemId: string;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
