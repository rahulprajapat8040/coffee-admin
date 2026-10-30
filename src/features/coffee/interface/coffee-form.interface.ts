
export interface ICoffeeForm {
  name: string;
  description: string;
  image: string;
  categoryId: string;
  variants: ICoffeeVariant[];
}

export interface ICoffeeVariant {
  size: string;
  price: string;
}