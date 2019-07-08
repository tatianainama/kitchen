import React, { ReactComponentElement, useState } from 'react';
import { Formik, Field, FieldArray, FormikActions, FormikProps, FieldArrayRenderProps } from 'formik';
import Recipe, { Ingredient, SubRecipe } from 'src/types/recipes';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import './styles.scss';
import sample_image from 'sample.png';

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

class IngredientsList extends React.Component<IngredientsListProps, {selectedTab: number}> {
  constructor(props: IngredientsListProps) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }

  render() {
    const ingredients = this.props.ingredients;
    return (
      <section className='ingredient-tabs'>

        <ul className='tab-header'>
          {
            ingredients.map((subgroup: any, index: number) => (
              <li className='tab' key={index} onClick={()=>{ this.setState({ selectedTab: index })}}>
                {subgroup.name}
              </li>
            ))  
          }
        </ul>
        <div>
          {
            ingredients[this.state.selectedTab].ingredients.map(i => i.name)
          }
        </div>
      </section>
    )
  }
}

const Pls = ({form, remove, push}:any) => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div className='ingredient-tabs'>
      <ul className='tab-header'>
        {
          form.values.ingredients.map((subrecipe: any, index: number) => (
            <li
              className={`tab${selectedTab === index ? ' tab--selected' : ''}`}
              key={index}
            >
              <div className='tab__content' onClick={()=> setSelectedTab(index)}> 
                <Field name={`ingredients[${index}].name`}/>
              </div>
              <button onClick={()=> remove(index)}>X</button>
            </li>
          ))
        }
        <li className='tab tab--add'>
          <button onClick={()=> push({name: '', ingredients: []})}>+</button>
        </li>
      </ul>
      {
        form.values.ingredients[selectedTab].ingredients.map((i: any) => i.name + ' ')
      }
    </div>
  )
}

const RenderForm = ({
  values,
  status,
  handleChange,
  handleSubmit
}: any) => {
  

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
          component={Pls}
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