import { Component, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../recipe.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrl: './ingredient-form.component.css'
})
export class IngredientFormComponent {
  @Output() emitIngredient = new EventEmitter<Ingredient>();
  myForm: FormGroup;
  ingredientOptions: Ingredient[] = [];

  ngOnInit() {
    this.recipeService.getIngredients().subscribe((ingredients: Ingredient[]) => {
      this.ingredientOptions = ingredients;
    });
  }

  constructor(private fb: FormBuilder, private recipeService: RecipeService) {
    this.myForm = this.fb.group({
      showTextInput: [false], // This will be bound to the checkbox
      dropdown: null,
      textInput: '',
      amount: ''
    });
  }

  updateIngredientOptions() {
    this.recipeService.getIngredients().subscribe((ingredients: Ingredient[]) => {
      this.ingredientOptions = ingredients;
    });
  }

  onSubmit() {
    if (!this.myForm.value.showTextInput) {
      const selectedIngredient: Ingredient = this.myForm.value.dropdown;
      if (selectedIngredient) {
        selectedIngredient.amount = this.myForm.value.amount;
        // Emit dropdownValue
        this.emitIngredient.emit(selectedIngredient);
      }
    } else {
      console.log("textInput: ", this.myForm.value.textInput);
      const textInput = { name: this.myForm.value.textInput, amount: this.myForm.value.amount };
      if (textInput) {
        // Emit textInputValue
        console.log("ingredient-form onSubmit(): ", textInput);
        this.emitIngredient.emit(textInput);
      }
    }
  }
}
