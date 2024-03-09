import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient, Recipe } from './recipe.model';



@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  apiUrl = 'http://localhost:8081/recipes';


  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  addRecipe(recipe: Recipe): Observable<Recipe[]> {
    console.log("recipe.service addRecipe(): ", recipe);
    return this.http.post<Recipe[]>(this.apiUrl, recipe);
  }

  deleteRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.http.delete<Recipe[]>(`${this.apiUrl}/${recipe.id}`);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.http.put<Recipe[]>(`${this.apiUrl}/${recipe.id}`, recipe);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>('http://localhost:8081/ingredients');
  }
}

/*
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: any[] = [];

  constructor() {
    this.loadRecipes();
  }

  addRecipe(recipe: any) {
    this.recipes.push(recipe);
    this.saveRecipes();
    console.log(this.recipes);
  }

  getRecipes() {
    return this.recipes;
  }

  setRecipes(recipes: any[]) {
    this.recipes = recipes;
    this.saveRecipes();
  }

  private loadRecipes() {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      this.recipes = JSON.parse(storedRecipes);
    }
  }

  private saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
  }
}
*/