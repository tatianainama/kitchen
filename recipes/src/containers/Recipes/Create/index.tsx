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
              "name": "For the Chicken:",
              "ingredients": [
                  {
                      "name": "thin boneless skinless chicken breast",
                      "quantity": 1.5,
                      "unit": "lb",
                      "_original": "1-1/2 lb of Thin Boneless Skinless Chicken Breast",
                      "suggestions": [
                      ]
                  },
                  {
                    "name": "plain greek yogurt",
                    "quantity": 0.5,
                    "unit": "cup",
                    "_original": "1/2 cup of Plain Greek Yogurt",
                    "suggestions": [
                        {
                            "_id": "5d1659a3dae0822ea455db16",
                            "name": "yogurt",
                            "variants": [
                                "plain yogurt"
                            ],
                            "equivalence": 245,
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
                        }
                    ]
                  },
                  {
                      "name": "olive oil",
                      "quantity": 2,
                      "unit": "tbsp",
                      "_original": "2 Tbsp of Olive Oil",
                      "suggestions": [
                      ]
                  },
                  {
                      "name": "juice of  lime",
                      "quantity": 1,
                      "unit": "",
                      "_original": "Juice of 1 Lime",
                      "suggestions": []
                  },
                  {
                      "name": "chili powder",
                      "quantity": 0.5,
                      "unit": "tsp",
                      "_original": "1/2 tsp of Chili Powder",
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
                      "name": "oregano",
                      "quantity": 0.5,
                      "unit": "tsp",
                      "_original": "1/2 tsp of Oregano",
                      "suggestions": []
                  },
                  {
                      "name": "cumin",
                      "quantity": 0.5,
                      "unit": "tsp",
                      "_original": "1/2 tsp of Cumin",
                      "suggestions": []
                  },
                  {
                      "name": "paprika",
                      "quantity": 0.5,
                      "unit": "tsp",
                      "_original": "1/2 tsp of Paprika",
                      "suggestions": []
                  },
                  {
                      "name": "granulated garlic",
                      "quantity": 0.5,
                      "unit": "tsp",
                      "_original": "1/2 tsp of Granulated Garlic",
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
                          }
                      ]
                  },
                  {
                      "name": "salt, to taste",
                      "quantity": 0,
                      "unit": "",
                      "_original": "Salt, to taste",
                      "suggestions": []
                  }
              ]
          },
          {
              "name": "For the Dressing:",
              "ingredients": [
                  {
                      "name": "fresh cilantro",
                      "quantity": 1,
                      "unit": "cup",
                      "_original": "1 cup of Fresh Cilantro",
                      "suggestions": []
                  },
                  {
                      "name": "scallions, roughly chopped",
                      "quantity": 2,
                      "unit": "",
                      "_original": "2 Scallions, roughly chopped",
                      "suggestions": []
                  },
                  {
                      "name": "juice of  lime or more, according to taste",
                      "quantity": 1,
                      "unit": "",
                      "_original": "Juice of 1 Lime or more, according to taste",
                      "suggestions": []
                  },
                  {
                      "name": "olive oil",
                      "quantity": 1,
                      "unit": "tbsp",
                      "_original": "1 Tbsp of Olive Oil",
                      "suggestions": [
                      ]
                  },
                  {
                      "name": "salt, to taste",
                      "quantity": 0,
                      "unit": "",
                      "_original": "Salt, to taste",
                      "suggestions": []
                  }
              ]
          },
          {
              "name": "For the rest of the salad:",
              "ingredients": [
                  {
                      "name": "fresh lettuce of your choice",
                      "quantity": 0,
                      "unit": "",
                      "_original": "Fresh Lettuce of your choice",
                      "suggestions": []
                  },
                  {
                      "name": "bell peppers, halved and seeded",
                      "quantity": 2,
                      "unit": "",
                      "_original": "2 Bell Peppers, halved and seeded",
                      "suggestions": []
                  },
                  {
                      "name": "scallions or red onion, sliced",
                      "quantity": 0,
                      "unit": "",
                      "_original": "Scallions or REd Onion, sliced",
                      "suggestions": []
                  },
                  {
                      "name": "pico de gallo salsa",
                      "quantity": 0.5,
                      "unit": "cup",
                      "_original": "1/2 cup of Pico De Gallo Salsa",
                      "suggestions": []
                  },
                  {
                      "name": "avocado, sliced",
                      "quantity": 1,
                      "unit": "",
                      "_original": "1 Avocado, sliced",
                      "suggestions": []
                  }
              ]
          }
      ],
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