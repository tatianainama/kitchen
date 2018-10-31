interface QtyMetric {
  qty: Number;
  unit: String;
}

interface Ingredient {
  name: String;
  qtyMetric: QtyMetric;
  qtyCups: Number;
  note: String;
}

interface Temperature {
  celsius: Number;
  farenheid: Number;
}

class Recipe {
  public name: String;
  tags!: String[];
  ingredients!: Ingredient[];
  servings!: Number;
  cookTime!: Number;
  preparationTime!: Number;
  directions!: String[];

  constructor(name:string) {
    this.name = name;
  }
}

export default Recipe;