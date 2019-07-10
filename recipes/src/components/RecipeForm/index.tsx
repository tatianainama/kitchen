import React, { useState } from 'react';
import { Formik, Field, FieldArray, FormikActions, FormikProps, FieldArrayRenderProps } from 'formik';
import Recipe, { Ingredient, SubRecipe, Suggestion, _ingredient } from 'types/recipes';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import './styles.scss';
import sample_image from 'sample.png';
import { MeasuresTypes } from 'services/measurements';

type IngredientsListProps = {
  ingredients: SubRecipe[],
}

type RecipeFormProps = {
  initialValues: Recipe
}

const custom = (label: string, component = 'text') => ({field}: any) => (
  <span>
    <label>
      {label}
    </label>
    {
      component === 'text' ? 
        <input {...field}/> :
        <textarea {...field}/>
    }
  </span>
);

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
              <button type='button' onClick={()=> remove(subrecipeIdx)}>X</button>
            </li>
          ))
        }
        <li className='tab tab--add'>
          <button type='button' onClick={()=> push({name: '', ingredients: []})}>+</button>
        </li>
      </ul>
      <div className='ingredients-form'>
        <div className='ingredients-form-header'>
          <span>Ingredient Name</span>
          <span>Quantity</span>
          <span>Unit</span>
          <span>Notes</span>
          <span>Original</span>
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
                        <Field name={`ingredients[${selectedTab}].ingredients[${index}].name`} />
                        <Field name={`ingredients[${selectedTab}].ingredients[${index}].quantity`}/>
                        <Field component='select' name={`ingredients[${selectedTab}].ingredients[${index}].unit`}>
                          {
                            measurements.map((measure, measureIdx) => (
                              <option key={measureIdx} value={measure}>{measure}</option>    
                            ))
                          }
                          <option value=''></option>
                        </Field>
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
          <Field name='name' render={custom('name')}/>
  
          <Field name='summary' render={custom('summary', 'textarea')}/>
        </Cell>
      </Row>
      
      <h5>Author Information</h5>
      <section>
        <Row>
          <Cell columns={3}>
            <Field name='author.name'/>
          </Cell>
          <Cell columns={3}>
            <Field name='author.website'/>
          </Cell>
        </Row>
      </section>
  
      <h5>Recipe Information</h5>
      <section>
        <Row>
          <Cell columns={3}>
            <Field name='details.preparationTime'/>
          </Cell>
          <Cell columns={3}>
            <Field name='details.cookingTime'/>
          </Cell>
          <Cell columns={3}>
            <Field name='details.servings' type='number'/>
          </Cell>
          <Cell columns={3}>
            <Field name='details.url'/>
          </Cell>
          <Cell columns={12}>
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