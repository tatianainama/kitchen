import React, { useState } from 'react';
import { Formik, Field, FieldArray, FormikActions, FormikProps, FieldProps } from 'formik';
import Recipe, { Ingredient, SubRecipe, Suggestion, _ingredient } from 'types/recipes';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import './styles.scss';
import sample_image from 'sample.png';
import { MeasuresTypes } from 'services/measurements';
import { LightInput as Input } from 'components/Input';
import Button from 'components/Button';

type RecipeFormProps = {
  initialValues: Recipe
}

const convertIngredient = (ingredient: Ingredient, suggestion: Suggestion): Ingredient => {
  if (ingredient.unit === suggestion.referenceUnit) {
    return {
      ...ingredient,
      unit: suggestion.prefferedUnit,
      quantity: suggestion.equivalence * ingredient.quantity
    }
  }
  return ingredient;
}


const SubrecipeForm = (props: any) => {
  console.log(props);
  const {form, remove, push} = props;
  const subrecipes = form.values.ingredients;
  const [selectedTab, setSelectedTab] = useState(0);
  const measurements = MeasuresTypes();
  return (
    <div className='subrecipe-tabs'>
      <ul className='tab-header'>
        {
          subrecipes.map((subrecipe: any, subrecipeIdx: number) => (
            <li
              className={`tab${selectedTab === subrecipeIdx ? ' tab--selected' : ''}`}
              key={subrecipeIdx}
            >
              <div className='tab__content' onClick={()=> setSelectedTab(subrecipeIdx)}> 
                <Field name={`ingredients[${subrecipeIdx}].name`}/>
              </div>
              <Button className='remove' type='button' icon='clear' onClick={() => remove(subrecipeIdx)}></Button>
              <span></span>
            </li>
          ))
        }
        <li className='tab tab--add'>
          <Button type='button' icon='add' onClick={() => push({name: '', ingredients: []})}></Button>
        </li>
      </ul>
      <div className='ingredients-form'>
        <div className='ingredients-form-header'>
          <div>Ingredient Name</div>
          <div>Quantity</div>
          <div>Unit</div>
          <div>Notes</div>
          <div>Original</div>
        </div>
        <FieldArray
          name={`ingredients[${selectedTab}].ingredients`}
          render={ (ingredientHelpers: any) => {
            return (
              <div>
                {
                  form.values.ingredients[selectedTab].ingredients.map((ingredient: Ingredient, index: number) => (
                    <div key={index}>
                      <div className='ingredients-form-item'>
                        <Field name={`ingredients[${selectedTab}].ingredients[${index}].name`}/>
                        <Field name={`ingredients[${selectedTab}].ingredients[${index}].quantity`}/>
                        <Field component='select' name={`ingredients[${selectedTab}].ingredients[${index}].unit`}>
                          {
                            measurements.map((measure, measureIdx) => (
                              <option key={measureIdx} value={measure}>{measure}</option>    
                            ))
                          }
                          <option value=''></option>
                        </Field>
                        <Field name={`ingredients[${selectedTab}].ingredients[${index}].notes`}/>
                        <Field name={`ingredients[${selectedTab}].ingredients[${index}]._original`} disabled/>
                        <button type='button' onClick={() => ingredientHelpers.remove(index)}>x</button>
                      </div>
                      <div className='ingredients-form-suggestions'>
                        {
                          ingredient.suggestions && ingredient.suggestions.map((suggestion, sugIdx) => (
                            <button
                              type='button'
                              key={sugIdx}
                              onClick={() => {
                                form.setFieldValue(
                                  `ingredients[${selectedTab}].ingredients[${index}]`,
                                  convertIngredient(ingredient, suggestion)
                                )
                              }}
                            >{suggestion.name}</button>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
                <button type='button' onClick={() => ingredientHelpers.push({ ..._ingredient })}>add ingredient</button>
              </div>
            )
          }}
        />
        
      </div>
    </div>
  )
}

const RenderForm = ({
  values,
  handleChange,
  handleSubmit
}: FormikProps<Recipe>) => {
  return (
    <Grid>
      <form onSubmit={handleSubmit} className='cbk-recipe-form'>
      <Row>
        <Cell columns={2}>
          <img src={sample_image} style={{ width: '100%' }}/>
        </Cell>
        <Cell columns={10}>
          <Field name='name' render={Input('name')}/>
  
          <Field name='summary' render={Input('summary', 'textarea')}/>
        </Cell>
      </Row>
      
      <h5>Author Information</h5>
      <section>
        <Row>
          <Cell columns={3}>
            <Field name='author.name' render={Input('name')}/>
          </Cell>
          <Cell columns={3}>
            <Field name='author.website' render={Input('website')}/>
          </Cell>
        </Row>
      </section>
  
      <h5>Recipe Information</h5>
      <section>
        <Row>
          <Cell columns={3}>
            <Field name='details.preparationTime' render={Input('preparation time')}/>
          </Cell>
          <Cell columns={3}>
            <Field name='details.cookingTime' render={Input('cooking time')}/>
          </Cell>
          <Cell columns={3}>
            <Field name='details.servings' render={Input('servings', 'number')}/>
          </Cell>
          <Cell columns={3}>
            <Field name='details.url' render={Input('recipe url')}/>
          </Cell>
        </Row>
      </section>
  
      <h5>Ingredients</h5>
      
      <section>
        <FieldArray
          name='ingredients'
          component={SubrecipeForm}
        />
      </section>
  
      <h5>Instructions</h5>
      <section>
        {
          values.instructions.map((instruction: any, i: number) => (
            <Row key={i}>
              <Cell columns={12}>
                <input
                  type='text'
                  id={`instructions[${i}]`}
                  value={instruction}
                  onChange={handleChange}
                />
              </Cell>
            </Row>
          ))
        }
      </section>
      <button type='submit'>Submit</button>    
      </form>
    </Grid>
    
      
  );
}

const RecipeForm = ({ initialValues }: RecipeFormProps) => (
  <Formik
    initialValues={initialValues}
    onSubmit={(values: any, actions:any) => {
      console.log('submit', values, actions)
    }}
    render={RenderForm}
  />
);

export default RecipeForm;