export interface Recipe {
  id?: number;
  title: string;
  ingredients: Ingredient[];
  directions: string;
}

export interface Ingredient {
  id?: number;
  name: string;
  amount?: string;
}