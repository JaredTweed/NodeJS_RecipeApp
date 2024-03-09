import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {
  @Output() editRecipe = new EventEmitter<Recipe | null>();
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      console.log(recipes);
      this.recipes = recipes;
    });
  }

  viewRecipe(recipe: Recipe) {
    alert(`Selected Recipe: ${recipe.title}\n\nIngredients:\n${recipe.ingredients.map(ingredient => `${ingredient.name} (${ingredient.amount})`).join('\n')}\n\nDirections:\n${recipe.directions}`);
  }

  updateRecipe(recipe: Recipe) {
    console.log(`Updated Recipe: ${recipe.id}`);
    this.editRecipe.emit(recipe);
  }

  deleteRecipe(recipe: Recipe) {
    this.recipeService.deleteRecipe(recipe).subscribe(recipeList => {
      console.log(`Deleted Recipe: ${recipeList}`);
      this.recipes = this.recipes.filter(r => r.id !== recipe.id);
    });
  }

  refreshList() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }
}


