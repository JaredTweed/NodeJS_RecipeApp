import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ingredient } from '../recipe.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrl: './ingredient-form.component.css'
})
export class IngredientFormComponent {
  @Output() updateFormIngredients = new EventEmitter<Ingredient[]>();
  // @Input() recipeIngredients: Ingredient[] = [];
  myForm: FormGroup;
  ingredientOptions: Ingredient[] = [];
  recipeIngredients: Ingredient[] = [];

  ngOnInit() {
    this.updateIngredientOptions();
  }

  constructor(private fb: FormBuilder, private recipeService: RecipeService) {
    this.myForm = this.fb.group({
      showTextInput: [false], // This will be bound to the checkbox
      dropdown: null,
      textInput: '',
      amount: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  updateIngredientOptions() {
    this.recipeService.getIngredients().subscribe((ingredients: Ingredient[]) => {
      console.log("ingredient-form updateIngredientOptions(): ", ingredients);
      this.ingredientOptions = ingredients.filter(ingredient =>
        !this.recipeIngredients.some(i =>
          (i.id !== undefined && i.id === ingredient.id) ||
          (i.name !== undefined && i.name === ingredient.name)
        )
      );
      console.log("ingredient-form updateIngredientOptions() ingredientOptions: ", this.ingredientOptions);
      console.log("ingredient-form updateIngredientOptions() recipeIngredients: ", this.recipeIngredients);
    });
  }

  deleteIngredient(ingredient: Ingredient) {
    this.recipeIngredients = this.recipeIngredients.filter(i => i !== ingredient);
    this.updateIngredientOptions();
    this.updateFormIngredients.emit(this.recipeIngredients);
  }

  onSubmit() {
    let inputSuccessful: boolean = false;
    if (this.myForm.value.amount !== '' && this.myForm.value.amount !== null && this.myForm.value.amount !== undefined) {
      if (!this.myForm.value.showTextInput) {
        console.log("dropdown: ", this.myForm.value.dropdown);
        const selectedIngredient: Ingredient = this.myForm.value.dropdown;
        // this.ingredientOptions = this.ingredientOptions.filter(ingredient => ingredient !== selectedIngredient);
        console.log("selectedIngredient: ", selectedIngredient);
        if (selectedIngredient) {
          selectedIngredient.amount = this.myForm.value.amount;
          // Emit dropdownValue
          this.recipeIngredients.push(selectedIngredient);
          this.updateIngredientOptions();
          this.updateFormIngredients.emit(this.recipeIngredients);
          inputSuccessful = true;
        }
      } else {
        console.log("textInput: ", this.myForm.value.textInput);
        const textInput = { name: this.myForm.value.textInput, amount: this.myForm.value.amount };
        if (textInput && this.myForm.value.textInput && textInput.name !== '') {
          // Emit textInputValue
          console.log("ingredient-form onSubmit(): ", textInput);
          this.recipeIngredients.push(textInput);
          this.updateIngredientOptions();
          this.updateFormIngredients.emit(this.recipeIngredients);
          inputSuccessful = true;
        }
      }
    }

    if (inputSuccessful) { this.myForm.reset(); }
  }
}
