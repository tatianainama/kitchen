import React from 'react';
import { assocPath, remove } from 'ramda';
import  Navbar from 'components/Navbar';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import Btn from 'components/Button';

import Input from 'components/Input';
import TagInput from 'components/TagInput';

import './styles.scss';

import sample_img from "../../sample.png";
import IRecipe, { ISubRecipe, IAuthor, IDetails, _recipe, _subRecipe, _ingredient, IIngredient } from 'types/recipes';

type CreateRecipeProps = {
};

type CreateRecipeState = {
  form: IRecipe
};

// author?: {
//   name: string,
// },
// details?: {
//   preparationTime: string,
//   cookingTime: string,
//   servings: number
// },
// ingredients?: ISubRecipe[],
// instructions?: string[],
// tags?: string[],

type FormKeys = keyof IRecipe | keyof ISubRecipe | keyof IIngredient | keyof IAuthor | keyof IDetails | number;

class CreateRecipe extends React.Component<CreateRecipeProps, CreateRecipeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      form: { 
        ..._recipe,
      }
    }
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

  addButton = (subrecipe: number, index: number) => {
    return this.state.form.ingredients[subrecipe].ingredients.length === index +1 ?
      { icon: 'add_circle_outline', onClick: this.addIngredient(subrecipe, index) } :
      { icon: 'remove_circle_outline', onClick: this.removeIngredient(subrecipe, index)};
  }

  addSubrecipe = () => {
    console.log("new", this.state.form)
    // this.setState({
    //   form: {
    //     ...this.state.form,
    //     ingredients: this.state.form.ingredients.concat([_subRecipe]),
    //   }
    // })
  }
  
  render() {
    const { form } = this.state; 
    return (
      <div>
        <Navbar
          title="Create a recipe"
        />
        
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

            <h5>Recipe Information</h5>
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

            <h5>Ingredients</h5>
            {
              form.ingredients.map((group, i) => (
                <div key={i}>
                  <Row>
                    <Cell columns={3}>
                      <Input
                        label='group name'
                        value={group.name}
                        onChange={this.updateField(['ingredients', i, 'name'])}
                        button={{ icon: 'add_circle_outline', onClick: this.addSubrecipe }}
                      />
                    </Cell>
                  </Row>
                  {
                    group.ingredients.map((ingredient, j) => (
                      <Row key={j}>
                        <Cell columns={3}>
                          <Input
                            label="ingredient"
                            value={ingredient.name}
                            onChange={this.updateField(['ingredients', i, 'ingredients', j, 'name'])}
                          />
                        </Cell>
                        <Cell columns={3}>
                          <Input
                            label="quantity"
                            value={ingredient.quantity}
                            onChange={this.updateField(['ingredients', i, 'ingredients', j, 'quantity'])}
                          />
                        </Cell>
                        <Cell columns={3}>
                          <Input
                            label="unit"
                            value={ingredient.unit}
                            onChange={this.updateField(['ingredients', i, 'ingredients', j, 'unit'])}
                          />
                        </Cell>
                        <Cell columns={3}>
                          <Input
                            label="original/notes"
                            value={ingredient._original}
                            onChange={this.updateField(['ingredients', i, 'ingredients', j, '_original'])}
                            button={this.addButton(i, j)}
                          />
                        </Cell>
                      </Row>
                    ))
                  }
                </div>
              ))
            }
          </Grid>
        </div>

      </div>
    )
  }
}

export default CreateRecipe;