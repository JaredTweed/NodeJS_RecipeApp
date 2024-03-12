import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Ingredient, Recipe } from '../recipe.model'
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Output() recipeAdded = new EventEmitter<void>();
  @ViewChild(IngredientFormComponent) ingredientForm: IngredientFormComponent | undefined;
  myForm: FormGroup;
  currentRecipe: Recipe | null = null;

  recipeIngredients: Ingredient[] = [];

  constructor(private fb: FormBuilder, private recipeService: RecipeService) {
    this.myForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      ingredients: [this.recipeIngredients, Validators.required],
      directions: ['', Validators.required]
    });
  }

  // Add a method to set the currentRecipe property to the recipe to be edited
  editThis(editRecipe: Recipe | null) {
    this.currentRecipe = editRecipe;
    this.ingredientForm?.myForm.reset();
    this.ingredientForm?.updateIngredientOptions();
    if (editRecipe === null) {
      this.myForm.reset();
      if (this.ingredientForm) {
        this.ingredientForm.recipeIngredients = [];
      }
      return;
    }
    this.myForm.patchValue(editRecipe);
    console.log(typeof editRecipe.ingredients);
    if (this.ingredientForm) {
      this.ingredientForm.recipeIngredients = editRecipe.ingredients;
    }
  }

  recipeDeleted(recipe: Recipe) {
    console.log("Recipe deleted: ", recipe);
    if (this.currentRecipe?.id === recipe.id) {
      this.editThis(null);
    } else {
      this.ingredientForm?.updateIngredientOptions();
    }
  }

  updateIngredients(ingredients: Ingredient[]) {
    console.log("form addIngredient(): ", ingredients);
    this.recipeIngredients = ingredients;
    this.myForm.patchValue({ ingredients: this.recipeIngredients });
  }


  onSubmit() {
    if (this.myForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    console.log("Added Recipe: ", this.myForm.value);

    // Capitalize the first letter of each word in the title
    const title = this.myForm.value.title;
    const words = title.split(' ');
    const titleCase = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    this.myForm.patchValue({ title: titleCase });

    // When editing a recipe
    if (this.currentRecipe) {
      this.recipeService.updateRecipe({ id: this.currentRecipe.id, ...this.myForm.value }).subscribe(recipe => {
        console.log("Recipe updated");
        this.recipeAdded.emit();
        this.editThis(null);
      });
      return;
    }

    console.log("form onSubmit(): ", this.myForm.value);

    // When making a new a recipe
    this.recipeService.addRecipe(this.myForm.value).subscribe(recipe => {
      console.log("Recipe added");
      this.recipeAdded.emit();
      this.editThis(null);
    });
  }
}

