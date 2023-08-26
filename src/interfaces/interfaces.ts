export interface IItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  category: string | null;
  tags: string[];
  quantity: number;
  availability: boolean;
  images: string[];
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
