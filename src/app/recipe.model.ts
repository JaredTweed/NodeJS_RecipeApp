export interface Recipe {
  id?: number;
  title: string;
  ingredients: Ingredient[];
  directions: string;
  timelastmodified?: Date;
}

export interface Ingredient {
  id?: number;
  name: string;
  amount?: string;
}