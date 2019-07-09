import React, { useState } from 'react';
import { Formik, Field, FieldArray, FormikActions, FormikProps, FieldArrayRenderProps } from 'formik';
import Recipe, { Ingredient, SubRecipe } from 'src/types/recipes';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import './styles.scss';
import sample_image from 'sample.png';
import { GetMeasure, MeasuresTypes } from 'services/measurements';

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

const SubrecipeForm = ({form, remove, push}: any) => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div className='subrecipe-tabs'>
      <ul className='tab-header'>
        {
          form.values.ingredients.map((subrecipe: any, i: number) => (
            <li
              className={`tab${selectedTab === i ? ' tab--selected' : ''}`}
              key={i}
            >
              <div className='tab__content' onClick={()=> setSelectedTab(i)}> 
                <Field name={`ingredients[${i}].name`}/>
              </div>
              <button type='button' onClick={()=> remove(i)}>X</button>
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
        {
          form.values.ingredients[selectedTab].ingredients.map((ingredient: Ingredient, index: number) => (
            <div key={index}>
              <div className='ingredients-form-item'>
                <Field name={`ingredients[${selectedTab}].ingredients[${index}].name`} />
                <Field name={`ingredients[${selectedTab}].ingredients[${index}].quantity`}/>
                <Field component='select' name={`ingredients[${selectedTab}].ingredients[${index}].unit`}>
                  {
                    MeasuresTypes().map((measure, i) => (
                      <option key={i} value={measure}>{measure}</option>    
                    ))
                  }
                  <option value=''></option>
                  {/* <option value='gr'>gr</option>
                  <option value='cup'>cup</option>
                  <option value='ml'>ml</option>
                  <option value='tablespoon'>tbsp</option>
                  <option value='teaspoon'>tsp</option> */}
                </Field>
                <Field name={`ingredients[${selectedTab}].ingredients[${index}].notes`} />
                <Field name={`ingredients[${selectedTab}].ingredients[${index}]._original`}/>
              </div>
              <div className='ingredients-form-suggestions'>
                {
                  ingredient.suggestions && ingredient.suggestions.map((suggestion, index) => (
                    <button type='button' key={index}>{suggestion.name}</button>
                  ))
                }
                <button type='button'>Add convertion</button>
              </div>
            </div>
          ))
        }
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