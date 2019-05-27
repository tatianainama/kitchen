import React from 'react';
import { assocPath, remove } from 'ramda';
import  Navbar from 'components/Navbar';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import Btn from 'components/Button';

import Input from 'components/Input';
import TagInput from 'components/TagInput';
import Select from 'components/Select';

import './styles.scss';

import { scrapeRecipe } from './services';

import sample_img from "../../sample.png";
import IRecipe, { ISubRecipe, IAuthor, IDetails, _recipe, _subRecipe, _ingredient, IIngredient } from 'types/recipes';

type CreateRecipeProps = {
};

type CreateRecipeState = {
  form: IRecipe,
  scrapeUrl: string,
};

type FormKeys = keyof IRecipe | keyof ISubRecipe | keyof IIngredient | keyof IAuthor | keyof IDetails | number;

class CreateRecipe extends React.Component<CreateRecipeProps, CreateRecipeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      form: { 
        ..._recipe,
      },
      scrapeUrl: '',
    }
  }

  scrapeRecipe = () => {
    scrapeRecipe(this.state.scrapeUrl).then(recipe => {
      this.setState({
        form: {
          ...recipe,
          details: {
            url: this.state.scrapeUrl,
            ...recipe.details,
          }
        }
      })
    })
  }

  updateField = (key: FormKeys[]) => {
    return (e: any) => {
      const newValue = e.currentTarget.value;
      this.setState({
        form: assocPath(key, newValue, this.state.form)
      } as Pick<CreateRecipeState, keyof CreateRecipeState>)
    }
  }

  addIngredient = (subrecipe: number, last: number) => {
    return () => {
      const { ingredients } = this.state.form;
      if (ingredients[subrecipe].ingredients[last].name) {
        const newIngredients = ingredients[subrecipe].ingredients.concat([_ingredient]);

        this.setState({
          form: {
            ...this.state.form,
            ingredients: assocPath([subrecipe, 'ingredients'], newIngredients, this.state.form.ingredients)
          }
        })
      }
    }
  }

  removeIngredient = (subrecipe: number, index: number) => {
    return () => {
      const { ingredients } = this.state.form;
      this.setState({
        form: {
          ...this.state.form,
          ingredients: assocPath(
            [subrecipe, 'ingredients'],
            remove(index, 1, ingredients[subrecipe].ingredients),
            this.state.form.ingredients
          )
        }
      })
    }
  }

  addInstruction = () => {
    this.setState({
      form: {
        ...this.state.form,
        instructions: this.state.form.instructions.concat([''])
      }
    })
  }

  removeInstruction = (index: number) => {
    return () => {
      this.setState({
        form: {
          ...this.state.form,
          instructions: remove(index, 1, this.state.form.instructions)
        }
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
      form: {
        ...this.state.form,
        ingredients: this.state.form.ingredients.concat([_subRecipe]),
      }
    })
  }

  removeSubrecipe = (index: number) => {
    return () => {
      this.setState({
        form: {
          ...this.state.form,
          ingredients: remove(index, 1, this.state.form.ingredients)
        }
      })
    }
  }
  
  render() {
    const { form, scrapeUrl } = this.state; 
    return (
      <div>
        <Navbar
          title="Create a recipe"
        >
          <Input
            label='scrape recipe'
            value={scrapeUrl}
            onChange={(e: any)=>{ 
              console.log('data', e.currentTarget.value);
              this.setState({scrapeUrl: e.currentTarget.value})}}
            button={{
              icon: 'format_shapes',
              onClick: this.scrapeRecipe
            }}
          />
        </Navbar>
        
        <div className="cbk-create-recipe">
          <Grid>
            <Row>
              <Cell columns={2}>
                <img src={sample_img} style={{ width: '100%' }}/>
              </Cell>
              <Cell columns={10}>
                <Input 
                  label='name'
                  value={form.name}
                  onChange={this.updateField(['name'])}
                  style='display'
                />

                <Input
                  label='summary'
                  value={form.summary}
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
                    value={form.author.name}
                    onChange={this.updateField(['author', 'name'])}
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='website'
                    value={form.author.website}
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
                    value={form.details.preparationTime}
                    onChange={this.updateField(['details', 'preparationTime'])}
                    icon='preparation'
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='Cooking time'
                    value={form.details.cookingTime}
                    onChange={this.updateField(['details', 'cookingTime'])}
                    icon='cooking'
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='servings'
                    value={form.details.servings}
                    onChange={this.updateField(['details', 'servings'])}
                    type='number'
                    icon='servings'
                  />
                </Cell>
                <Cell columns={3}>
                  <Input
                    label='recipe url'
                    value={form.details.url || ''}
                    onChange={this.updateField(['details', 'url'])}
                    icon='recipe'
                  />
                </Cell>
                <Cell columns={12}>
                  <TagInput
                    initialValues={form.tags}
                    onNewTag={(tags) => { this.setState({
                      form: {
                        ...this.state.form,
                        tags,
                      }
                    })}}
                  />
                </Cell>
              </Row>
            </section>

            <h5>Ingredients</h5>
            <section>  
              {
                form.ingredients.map((group, i) => (
                  <div key={i}>
                    <Row>
                      <Cell columns={4}>
                        <Input
                          label='group name'
                          value={group.name}
                          onChange={this.updateField(['ingredients', i, 'name'])}
                          button={this.actionButton(form.ingredients, i, this.addSubrecipe, this.removeSubrecipe(i))}
                        />
                      </Cell>
                    </Row>
                    {
                      group.ingredients.map((ingredient, j) => (
                        <Row key={j}>
                          <Cell columns={4}>
                            <Input
                              label="ingredient"
                              value={ingredient.name}
                              onChange={this.updateField(['ingredients', i, 'ingredients', j, 'name'])}
                            />
                          </Cell>
                          <Cell columns={2}>
                            <Input
                              label="quantity"
                              value={ingredient.quantity}
                              onChange={this.updateField(['ingredients', i, 'ingredients', j, 'quantity'])}
                            />
                          </Cell>
                          <Cell columns={2}>
                            <Select
                              label='unit'
                              options={[
                                {label: 'grams', value: 'gr'},
                                {label: 'cups', value: 'cup'},
                                {label: 'mililiters', value: 'ml'},
                              ]}
                              onChange={(x) => {console.log('selected', x)}}
                            />
                          </Cell>
                          <Cell columns={4}>
                            <Input
                              label="original/notes"
                              value={ingredient._original}
                              onChange={this.updateField(['ingredients', i, 'ingredients', j, '_original'])}
                              button={this.actionButton(form.ingredients[i].ingredients, j, this.addIngredient(i, j), this.removeIngredient(i, j))}
                            />
                          </Cell>
                        </Row>
                      ))
                    }
                  </div>
                ))
              }
            </section>

            <h5>Instructions</h5>
            <section>
              {
                form.instructions.map((instruction, i) => (
                  <Row key={i}>
                    <Cell columns={12}>
                      <Input
                        label={`Step ${i+1}`}
                        value={instruction}
                        onChange={this.updateField(['instructions', i])}
                        button={this.actionButton(form.instructions, i, this.addInstruction, this.removeInstruction(i))}
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
          </Grid>
        </div>
      </div>
    )
  }
}

export default CreateRecipe;