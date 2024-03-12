import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient, Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  // apiIngredientUrl = '/api/ingredients';
  apiIngredientUrl = 'http://localhost:8081/ingredients';
  // apiRecipeUrl = '/api/recipes';
  apiRecipeUrl = 'http://localhost:8081/recipes';


  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiRecipeUrl);
  }

  addRecipe(recipe: Recipe): Observable<Recipe[]> {
    console.log("recipe.service addRecipe(): ", recipe);
    return this.http.post<Recipe[]>(this.apiRecipeUrl, recipe);
  }

  deleteRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.http.delete<Recipe[]>(`${this.apiRecipeUrl}/${recipe.id}`);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.http.put<Recipe[]>(`${this.apiRecipeUrl}/${recipe.id}`, recipe);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiIngredientUrl);
  }
}
