import React from 'react';
import { assocPath, remove } from 'ramda';
import  Navbar from 'components/Navbar';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import Btn from 'components/Button';
import Input from 'components/Input';
import TagInput from 'components/TagInput';
import { Form as IngredientForm } from 'components/Ingredient';
import RecipeForm from 'components/RecipeForm';

import './styles.scss';

import sample_img from "../../../sample.png";

import Recipe, { SubRecipe, Author, Details, _recipe, _subRecipe, _ingredient, Ingredient } from 'types/recipes';
import { scrapeRecipe } from '../services';

interface CreateRecipeProps {
};

interface CreateRecipeState extends Recipe {
  scrapeUrl: string,
  form: Recipe,
};

type FormKeys = keyof Recipe | keyof SubRecipe | keyof Ingredient | keyof Author | keyof Details | number;

class CreateRecipe extends React.Component<CreateRecipeProps, CreateRecipeState> {
  constructor(props: CreateRecipeProps) {
    super(props);
    this.state = { 
      ..._recipe,
      form: {
        ..._recipe,
        "ingredients": [
          {
            "name": "For the batter:",
            "ingredients": [
                {
                    "name": "all purpose flour",
                    "quantity": 1.5,
                    "unit": "cup",
                    "_original": "1-1/2 cups of All Purpose Flour",
                    "suggestions": [
                        {
                            "_id": "5d1659a3dae0822ea455db06",
                            "name": "all purpose flour",
                            "variants": [
                                "plain flour",
                                "all purpose flour",
                                "regular flour"
                            ],
                            "equivalence": 125,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "translation": {
                                "dutch": "patentbloem"
                            },
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db08",
                            "name": "pastry flour",
                            "variants": [
                                "pastry flour"
                            ],
                            "equivalence": 114,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "translation": {
                                "dutch": "zeeuwsebloem"
                            },
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db07",
                            "name": "bread flour",
                            "variants": [
                                "bread flour"
                            ],
                            "equivalence": 127,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "translation": {
                                "dutch": "tarwebloem"
                            },
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db09",
                            "name": "almond flour",
                            "equivalence": 96,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db0b",
                            "name": "self raising flour",
                            "equivalence": 125,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        }
                    ]
                },
                {
                    "name": "baking powder",
                    "quantity": 2,
                    "unit": "tsp",
                    "_original": "2 tsp of Baking Powder",
                    "suggestions": [
                        {
                            "_id": "5d1659a3dae0822ea455db17",
                            "name": "cocoa powder",
                            "variants": [
                                "cocoa"
                            ],
                            "equivalence": 118,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db12",
                            "name": "icing sugar",
                            "variants": [
                                "confectioner sugar",
                                "powdered sugar"
                            ],
                            "equivalence": 125,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        }
                    ]
                },
                {
                    "name": "salt",
                    "quantity": 0.5,
                    "unit": "tsp",
                    "_original": "1/2 tsp of Salt",
                    "suggestions": []
                },
                {
                    "name": "granulated sugar",
                    "quantity": 0.5,
                    "unit": "cup",
                    "_original": "1/2 cup of Granulated Sugar",
                    "suggestions": [
                        {
                            "_id": "5d1659a3dae0822ea455db11",
                            "name": "granulated sugar",
                            "variants": [
                                "sugar",
                                "plain sugar"
                            ],
                            "equivalence": 200,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db12",
                            "name": "icing sugar",
                            "variants": [
                                "confectioner sugar",
                                "powdered sugar"
                            ],
                            "equivalence": 125,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db13",
                            "name": "caster sugar",
                            "variants": [
                                "fine sugar"
                            ],
                            "equivalence": 225,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db14",
                            "name": "brown sugar",
                            "equivalence": 200,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        }
                    ]
                },
                {
                    "name": "unsalted butter, softened at room temperature",
                    "quantity": 0.5,
                    "unit": "cup",
                    "_original": "1/2 cup Unsalted Butter, softened at room temperature",
                    "suggestions": []
                },
                {
                    "name": "eggs",
                    "quantity": 2,
                    "unit": "",
                    "_original": "2 Eggs",
                    "suggestions": []
                },
                {
                    "name": "(you might need a bit more if the mixture is too thick) of milk",
                    "quantity": 0.666,
                    "unit": "cup",
                    "_original": "2/3 cup of Milk (you might need a bit more if the mixture is too thick)",
                    "suggestions": []
                },
                {
                    "name": "vanilla extract",
                    "quantity": 2,
                    "unit": "tsp",
                    "_original": "2 tsp of Vanilla Extract",
                    "suggestions": []
                }
            ]
        },
        {
            "name": "For the Filling:",
            "ingredients": [
                {
                    "name": "( i use honeycrisp) medium apples  peeled and diced",
                    "quantity": 2,
                    "unit": "",
                    "_original": "2 Medium apples ( I use Honeycrisp) peeled and diced",
                    "suggestions": []
                },
                {
                    "name": "apple butter",
                    "quantity": 0.333,
                    "unit": "cup",
                    "_original": "1/3 cup of Apple Butter",
                    "suggestions": []
                }
            ]
        },
        {
            "name": "For the Topping:",
            "ingredients": [
                {
                    "name": "brown sugar",
                    "quantity": 0.25,
                    "unit": "cup",
                    "_original": "1/4 cup of Brown sugar",
                    "suggestions": [
                        {
                            "_id": "5d1659a3dae0822ea455db14",
                            "name": "brown sugar",
                            "equivalence": 200,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db11",
                            "name": "granulated sugar",
                            "variants": [
                                "sugar",
                                "plain sugar"
                            ],
                            "equivalence": 200,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db12",
                            "name": "icing sugar",
                            "variants": [
                                "confectioner sugar",
                                "powdered sugar"
                            ],
                            "equivalence": 125,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db13",
                            "name": "caster sugar",
                            "variants": [
                                "fine sugar"
                            ],
                            "equivalence": 225,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        }
                    ]
                },
                {
                    "name": "all purpose flour",
                    "quantity": 2,
                    "unit": "tbsp",
                    "_original": "2 Tbsp of All Purpose Flour",
                    "suggestions": [
                        {
                            "_id": "5d1659a3dae0822ea455db06",
                            "name": "all purpose flour",
                            "variants": [
                                "plain flour",
                                "all purpose flour",
                                "regular flour"
                            ],
                            "equivalence": 125,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "translation": {
                                "dutch": "patentbloem"
                            },
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db08",
                            "name": "pastry flour",
                            "variants": [
                                "pastry flour"
                            ],
                            "equivalence": 114,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "translation": {
                                "dutch": "zeeuwsebloem"
                            },
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db07",
                            "name": "bread flour",
                            "variants": [
                                "bread flour"
                            ],
                            "equivalence": 127,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "translation": {
                                "dutch": "tarwebloem"
                            },
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db09",
                            "name": "almond flour",
                            "equivalence": 96,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        },
                        {
                            "_id": "5d1659a3dae0822ea455db0b",
                            "name": "self raising flour",
                            "equivalence": 125,
                            "referenceUnit": "cup",
                            "prefferedUnit": "g",
                            "measure": 2
                        }
                    ]
                },
                {
                    "name": "cold unsalted butter, cut into small pieces",
                    "quantity": 2,
                    "unit": "tbsp",
                    "_original": "2 Tbsp of Cold Unsalted Butter, cut into small pieces",
                    "suggestions": []
                },
                {
                    "name": "cinnamon",
                    "quantity": 1,
                    "unit": "tsp",
                    "_original": "1 tsp of Cinnamon",
                    "suggestions": []
                }
            ]
        }
      ],
        "instructions": [
          "cut",
          "cook",
          "mix"
        ]  
    },
      scrapeUrl: '',
    }
  }

  scrapeRecipe = () => {
    scrapeRecipe(this.state.scrapeUrl).then(recipe => {
      this.setState({
        ...recipe,
        details: {
          url: this.state.scrapeUrl,
          ...recipe.details,
        }
      })
    })
  }

  updateField = (key: FormKeys[]) => ({ currentTarget }: any) => {
    this.setState(prevState => assocPath(key, currentTarget.value, prevState))
  };

  updateSubrecipeName = (subrecipe: number, newValue: string) => {
    this.setState(assocPath(['ingredients', subrecipe, 'name'], newValue, this.state))
  }

  updateIngredientUnit = (key: Array<string | number | symbol>, newValue: string) => {
    this.setState(assocPath(key, newValue, this.state))
  }

  addIngredient = () => {
    return () => {
    }
  }

  removeIngredient = (subrecipe: number, index: number) => {
    return () => {
      const { ingredients } = this.state;
      this.setState({
        ingredients: assocPath(
          [subrecipe, 'ingredients'],
          remove(index, 1, ingredients[subrecipe].ingredients),
          this.state.ingredients
        )
      })
    }
  }

  addInstruction = () => {
    this.setState({
      instructions: this.state.instructions.concat([''])
    })
  }

  removeInstruction = (index: number) => {
    return () => {
      this.setState({
        instructions: remove(index, 1, this.state.instructions)
      })
    }
  }

  actionButton = (path: any[], index: number, AddFc: () => void, RemoveFc: () => void) => {
    const isLast = (xs: any[], i: number) => xs.length === i + 1;
    return isLast(path, index) ? 
    {
      icon: 'add_circle_outline',
      onClick: AddFc
    } : {
      icon: 'remove_circle_outline',
      onClick: RemoveFc
    }
  }

  addSubrecipe = () => {
    this.setState({
      ingredients: this.state.ingredients.concat([_subRecipe]),
    })
  }

  removeSubrecipe = (index: number) => {
    this.setState({
      ingredients: remove(index, 1, this.state.ingredients)
    })
  }
  
  render() {
    const { scrapeUrl } = this.state; 
    return (
      <div>
        <Navbar
          title="Create a recipe"
        >
          <Input
            label='scrape recipe'
            value={scrapeUrl}
            onChange={(e: any)=>{ 
              this.setState({scrapeUrl: e.currentTarget.value})}}
            button={{
              icon: 'format_shapes',
              onClick: this.scrapeRecipe
            }}
          />
        </Navbar>
        
        <div className="cbk-create-recipe">
          <RecipeForm
            initialValues={this.state.form}
          />
          {/* <Grid>
            <Row>
              <Cell columns={2}>
                <img src={sample_img} style={{ width: '100%' }}/>
              </Cell>
              <Cell columns={10}>
                <Input 
                  label='name'
                  value={this.state.name}
                  onChange={this.updateField(['name'])}
                  style='display'
                />

                <Input
                  label='summary'
                  value={this.state.summary}
                  onChange={this.updateField(['summary'])}
                  textarea
                />
              </Cell>
            </Row>
            
            <h5>Author Information</h5>
            <section>
              <Row>
                <Cell columns={3}>
                  <Input
                    label='name'
                    value={this.state.author.name}
                    onChange={this.updateField(['author', 'name'])}
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='website'
                    value={this.state.author.website}
                    onChange={this.updateField(['author', 'website'])}
                  />
                </Cell>
              </Row>
            </section>

            <h5>Recipe Information</h5>
            <section>
              <Row>
                <Cell columns={3}>
                  <Input
                    label='Preparation time'
                    value={this.state.details.preparationTime}
                    onChange={this.updateField(['details', 'preparationTime'])}
                    icon='preparation'
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='Cooking time'
                    value={this.state.details.cookingTime}
                    onChange={this.updateField(['details', 'cookingTime'])}
                    icon='cooking'
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='servings'
                    value={this.state.details.servings}
                    onChange={this.updateField(['details', 'servings'])}
                    type='number'
                    icon='servings'
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='recipe url'
                    value={this.state.details.url || ''}
                    onChange={this.updateField(['details', 'url'])}
                    icon='recipe'
                  />
                </Cell>
                <Cell columns={12}>
                  <TagInput
                    initialValues={this.state.tags}
                    onNewTag={(tags) => { this.setState({
                      tags
                    })}}
                  />
                </Cell>
              </Row>
            </section>

            <h5>Ingredients</h5>
            <section>
              <IngredientForm
                components={this.state.ingredients}
                updateField={this.updateField}
                addSubrecipe={this.addSubrecipe}
                updateSubrecipeName={this.updateSubrecipeName}
                removeSubrecipe={this.removeSubrecipe}
                updateIngredientUnit={this.updateIngredientUnit}
              />
            </section>

            <h5>Instructions</h5>
            <section>
              {
                this.state.instructions.map((instruction, i) => (
                  <Row key={i}>
                    <Cell columns={12}>
                      <Input
                        label={`Step ${i+1}`}
                        value={instruction}
                        onChange={this.updateField(['instructions', i])}
                        button={this.actionButton(this.state.instructions, i, this.addInstruction, this.removeInstruction(i))}
                      />
                    </Cell>
                  </Row>
                ))
              }
            </section>
            <Row>
              <Cell columns={12} className='cbk-create-recipe-actions'>
                <Btn raised unelevated>Create</Btn>
              </Cell>
            </Row>
          </Grid> */}
        </div>
      </div>
    )
  }
}

export default CreateRecipe;