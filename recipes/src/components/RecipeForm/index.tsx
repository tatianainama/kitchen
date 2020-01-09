import React, { useState, Component } from 'react';

import Recipe, { Ingredient, Suggestion, _ingredient, _subRecipe, DBRecipe } from 'types/recipes';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import './styles.scss';
import sample_image from 'sample.png';
import { MeasuresTypes } from 'services/measurements';
import { LightInput as Input } from 'components/Input';
import Button from 'components/Button';
import Dialog from 'components/DialogConverter';
import { GetMeasure } from 'services/measurements';
import TagInput from 'components/TagInput';

//@ts-ignore
import { Field, FieldArray, FormikProps, ArrayHelpers, Formik, useField, Form, FieldAttributes, FieldArrayRenderProps } from 'formik';
import TextField from '@material/react-text-field';

type RecipeFormProps<T> = {
  initialValues: T,
  onSubmit: (data: T) => void
}

const convertIngredient = (ingredient: Ingredient, suggestion: Suggestion): Ingredient => {
  if (ingredient.unit === suggestion.referenceUnit) {
    return {
      ...ingredient,
      unit: suggestion.prefferedUnit,
      quantity: suggestion.equivalence * ingredient.quantity
    }
  } else {
    if (ingredient.unit === suggestion.prefferedUnit) {
      alert('Reset values to original plox')
    }
  }
  return ingredient;
}


const SubrecipeForm = (props: any) => {
  const {form, remove, push} = props;
  const subrecipes = form.values.ingredients;
  const [selectedTab, setSelectedTab] = useState(0);
  const [focusLast, setFocusLast] = useState(false);
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
                <Field name={`ingredients[${subrecipeIdx}].name`} placeholder='subrecipe name'/>
              </div>
              <Button
                type='button'
                icon='clear'
                onClick={() => remove(subrecipeIdx)}
                disabled={subrecipes.length === 1}
                small
              ></Button>
              <span></span>
            </li>
          ))
        }
        <li className='tab tab--add'>
          <Button type='button' icon='add' onClick={() => push({..._subRecipe})}></Button>
        </li>
      </ul>
      <div className='ingredients-form'>
        <Row className='ingredients-form-header'>
          <Cell columns={4}>
            Ingredient Name
          </Cell>
          <Cell columns={1}>
            Quantity
          </Cell>
          <Cell columns={1}>
            Unit
          </Cell>
          <Cell columns={2}>
            Notes
          </Cell>
          <Cell columns={3}>
            Original
          </Cell>
        </Row>
        <FieldArray
          name={`ingredients[${selectedTab}].ingredients`}
          component={ (ingredientHelpers: any) => {
            return (
              <div>
                {
                  form.values.ingredients[selectedTab] && form.values.ingredients[selectedTab].ingredients.map((ingredient: Ingredient, index: number, array: Ingredient[]) => (
                    <div key={index} className='ingredients-form-item'>
                      <Row className='ingredient-detail'>
                        <Cell columns={4}>
                          <Field
                            name={`ingredients[${selectedTab}].ingredients[${index}].name`}
                            innerRef={(ref: any) => {
                              if(index === array.length-1 && ref && focusLast) {
                                ref.focus();
                                setFocusLast(false);
                              }
                            }}
                          />
                        </Cell>
                        <Cell columns={1}>
                          <Field name={`ingredients[${selectedTab}].ingredients[${index}].quantity`} type='number'/>
                          {ingredient.unit && ingredient.quantity ? (
                            <Dialog
                              measure={{unit: ingredient.unit, quantity: ingredient.quantity}}
                              onConvert={result => ingredientHelpers.replace(index, { ...ingredient, ...result })}
                            />
                          ): null}
                        </Cell>
                        <Cell columns={1}>
                          <Field component='select' name={`ingredients[${selectedTab}].ingredients[${index}].unit`}>
                            {
                              measurements.map((measure, measureIdx) => (
                                <option key={measureIdx} value={measure}>{measure}</option>    
                              ))
                            }
                            <option value=''></option>
                          </Field>  
                        </Cell>
                        <Cell columns={2}>
                          <Field name={`ingredients[${selectedTab}].ingredients[${index}].notes`}/>
                        </Cell>
                        <Cell columns={3}>
                          <Field name={`ingredients[${selectedTab}].ingredients[${index}]._original`} disabled/>
                        </Cell>
                        <Cell columns={1}> 
                          <Button type='button' icon='clear' onClick={() => {
                            ingredientHelpers.remove(index)
                          }}
                          disabled={form.values.ingredients[selectedTab].ingredients.length === 1}
                          small></Button>
                        </Cell>
                      </Row>
                      <div className='ingredient-suggestions'>
                        {
                          ingredient.suggestions && ingredient.suggestions.map((suggestion, sugIdx) => (
                            <button
                              className='suggestion'
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
                <Button
                  type='button'
                  onClick={() => {
                    ingredientHelpers.push({ ..._ingredient })
                    setFocusLast(true);                    
                  }}>
                    add ingredient
                  </Button>
              </div>
            )
          }}
        />
        
      </div>
    </div>
  )
}

type FormikInputProps = {
  [x: string]: any,
  label?: string,
  name: string,
};

const FormikInput = ({label, ...props}: FormikInputProps) => {
  const [field, meta] = useField(props);
  return (
    <>
      {
        label && (<label htmlFor={props.id || props.name}>{label}</label>)
      }
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  )
}

const RecipeForm = <T extends Recipe|DBRecipe>({ initialValues, onSubmit }: RecipeFormProps<T>) => (
  <>
  <div>
    <h4>New form</h4>
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log('submit', values)
      }}
    >
      {
        ({setFieldValue, submitForm}) => (
          <Grid>
            <Form className='cbk-recipe-form'>
            <Row>
              <Cell columns={2}>
                <img src={sample_image} style={{ width: '100%' }}/>
              </Cell>
              <Cell columns={10}>
                <Field name='name' component={Input('name')}/>
        
                <Field name='summary' component={Input('summary', 'textarea')}/>
              </Cell>
            </Row>
            
            <h5>Author Information</h5>
            <section>
              <Row>
                <Cell columns={3}>
                  <Field name='author.name' component={Input('name')}/>
                </Cell>
                <Cell columns={3}>
                  <Field name='author.website' component={Input('website')}/>
                </Cell>
              </Row>
            </section>
        
            <h5>Recipe Information</h5>
            <section>
              <Row>
                <Cell columns={3}>
                  <Field name='details.preparationTime' component={Input('preparation time')}/>
                </Cell>
                <Cell columns={3}>
                  <Field name='details.cookingTime' component={Input('cooking time')}/>
                </Cell>
                <Cell columns={3}>
                  <Field name='details.servings' component={Input('servings', 'number')}/>
                </Cell>
                <Cell columns={3}>
                  <Field name='details.url' component={Input('recipe url')}/>
                </Cell>
              </Row>
              <Row>
                <Cell columns={12}>
                  <div>
                    <TagInput
                      label='tags'
                      onNewTag={(tags) => {
                        setFieldValue('tags', tags)
                      }}
                    />
                  </div>
                </Cell>
              </Row>
            </section>
        
            <h5>Ingredients</h5>
            <section>
              {/* <FieldArray
                name='ingredients'
                render={SubrecipeForm}
              /> */}
            </section>
        
            <h5>Instructions</h5>
            {/* <section>
              <FieldArray
                name='instructions'
                component={({remove, push}:ArrayHelpers) => (
                  <div>
                    {
                      values.instructions.map((instruction: string, instructionIdx: number) => (
                        <Row key={instructionIdx}>
                          <Cell columns={11}>
                            <Field name={`instructions[${instructionIdx}]`}/>
                          </Cell>
                          <Cell columns={1}>
                            <Button icon='clear' onClick={() => remove(instructionIdx)} small></Button>
                          </Cell>
                        </Row>
                      ))
                    }
                    <Button type="button" onClick={() => push('')}>Add instruction</Button>
                  </div>
                )}
              />
            </section> */}
            <Button type='button' raised unelevated onClick={() => submitForm()} >Submit</Button>
            </Form>
          </Grid>
        )
      }
    </Formik>
  </div>
  {/* <Formik
    enableReinitialize
    initialValues={initialValues}
    onSubmit={(values: any, actions:any) => onSubmit(values)}
  >
    {
      (props: any) => RenderForm(props)
    }
  </Formik> */}
  </>
);

export default RecipeForm;