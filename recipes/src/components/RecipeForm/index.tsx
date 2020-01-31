import React, { useState, forwardRef } from 'react';

import Recipe, { Ingredient, Suggestion, _ingredient, _subRecipe, DBRecipe } from 'types/recipes';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import { Field, FieldArray, Formik, useField, Form, FieldArrayRenderProps } from 'formik';
import { MeasuresTypes } from 'services/measurements';
import { Input, Textarea, ControlledInput } from 'components/Input';

import Button from 'components/Button';
import Dialog from 'components/DialogConverter';
import TagInput from 'components/TagInput';
import DurationPicker from 'components/DurationPicker';

import sample_image from 'sample.png';
import './styles.scss';

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

type FormikInputProps = {
  [x: string]: any,
  name: string,
  label?: string,
};

const FormikInput = ({ label, ...props }:FormikInputProps)  => {
  const [field, meta] = useField(props);
  return (
    <>
      <Input
        label={label}
        { ...props }
        { ...field }
      />
      {/* TODO: Add validation errors when onSubmit */}
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const FormikFocusInput = forwardRef<HTMLInputElement, FormikInputProps>(({ label, ...props }, ref)  => {
  const [field, meta] = useField(props);
  return (
    <>
      <ControlledInput
        ref={ref}
        label={label}
        { ...props }
        { ...field }
      />
      {/* TODO: Add validation errors when onSubmit */}
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
});

const FormikTextarea = ({ label, ...props }: FormikInputProps)  => {
  const [field, meta] = useField(props);
  return (
    <>
      <Textarea
        label={label}
        { ...props }
        { ...field }
      />
      {/* TODO: Add validation errors when onSubmit */}
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const RecipeForm = <T extends Recipe|DBRecipe>({ initialValues, onSubmit }: RecipeFormProps<T>) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [focusLast, setFocusLast] = useState(false);
  return (
  <div>
    <h4>New form</h4>
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log('submit', values)
      }}
    >
      {
        ({setFieldValue, submitForm, values}) => {
          return (
          <Grid>
            <Form className='cbk-recipe-form'>
            <Row>
              <Cell columns={2}>
                <img src={sample_image} style={{ width: '100%' }}/>
              </Cell>
              <Cell columns={10}>
                <FormikInput name='name' label='name' />
        
                <FormikTextarea name='summary' label='summary' />
              </Cell>
            </Row>
            
            <h5>Author Information</h5>
            <section>
              <Row>
                <Cell columns={3}>
                  <FormikInput name='author.name' label='name' />
                </Cell>
                <Cell columns={3}>
                  <FormikInput name='author.website' label='website' />
                </Cell>
              </Row>
            </section>
        
            <h5>Recipe Information</h5>
            <section>
              <Row>
                <Cell columns={3}>
                  {/* <FormikInput name='details.preparationTime' label='preparation time' /> */}
                  <DurationPicker
                    initialValue={initialValues.details.preparationTime}
                    onChange={(duration)=>{ setFieldValue('details.preparationTime', duration)}} 
                    label='preparation time'
                  />
                </Cell>
                <Cell columns={3}>
                  <FormikInput name='details.cookingTime' label='cooking time' />
                </Cell>
                <Cell columns={3}>
                  <FormikInput name='details.servings' label='servings' type='number' />
                </Cell>
                <Cell columns={3}>
                  <FormikInput name='details.url' label='recipe url' />
                </Cell>
              </Row>
              <Row>
                <Cell columns={12}>
                  <TagInput
                    tags={values.tags}
                    label='tags'
                    onNewTag={(tags) => setFieldValue('tags', tags)}
                  />
                </Cell>
              </Row>
              <Row>
                <Cell columns={12}>
                  <TagInput
                    tags={values.course}
                    label='dish course'
                    onNewTag={(dishCourse) => {console.log("dish", dishCourse, values); setFieldValue('course', dishCourse)}}
                  />
                </Cell>
              </Row>
            </section>
        
            <h5>Ingredients</h5>
            <section>
              <FieldArray name='ingredients'>
                {({remove, push}) => {
                  return (
                    <div className='subrecipe-tabs'>
                      <ul className='tab-header'>
                        {
                          values.ingredients.map((subrecipe, subrecipeIdx) => (
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
                                disabled={values.ingredients.length === 1}
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
                          <Cell columns={3}>
                            Ingredient Name
                          </Cell>
                          <Cell columns={2}>
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
                        <FieldArray name={`ingredients[${selectedTab}].ingredients`}>
                          { (ingredientHelpers: any) => {
                            return (
                              <div>
                                {
                                  values.ingredients[selectedTab] && values.ingredients[selectedTab].ingredients.map((ingredient, index, array) => (
                                    <div key={index} className='ingredients-form-item'>
                                      <Row className='ingredient-detail'>
                                        <Cell columns={3}>
                                          <FormikFocusInput name={`ingredients[${selectedTab}].ingredients[${index}].name`} 
                                            ref={(ref: any) => {
                                              if(index === array.length-1 && ref && focusLast) {
                                                ref.focus();
                                                setFocusLast(false);
                                              }
                                            }}
                                          />
                                        </Cell>
                                        <Cell columns={2}>
                                          <FormikInput name={`ingredients[${selectedTab}].ingredients[${index}].quantity`} type='number'/>
                                          {ingredient.unit && ingredient.quantity ? (
                                            <Dialog
                                              measure={{unit: ingredient.unit, quantity: ingredient.quantity}}
                                              onConvert={result => ingredientHelpers.replace(index, { ...ingredient, ...result })}
                                            />
                                          ): null}
                                        </Cell>
                                        <Cell columns={1}>
                                          <Field component='select' name={`ingredients[${selectedTab}].ingredients[${index}].unit`}>
                                            <option value=''></option>
                                            {
                                              MeasuresTypes.map((measure, measureIdx) => (
                                                <option key={measureIdx} value={measure}>{measure}</option>    
                                              ))
                                            }
                                          </Field>  
                                        </Cell>
                                        <Cell columns={2}>
                                          <FormikInput name={`ingredients[${selectedTab}].ingredients[${index}].notes`}/>
                                        </Cell>
                                        <Cell columns={3}>
                                          <FormikInput name={`ingredients[${selectedTab}].ingredients[${index}]._original`} disabled/>
                                        </Cell>
                                        <Cell columns={1}> 
                                          <Button type='button' icon='clear' onClick={() => {
                                            ingredientHelpers.remove(index)
                                          }}
                                          disabled={values.ingredients[selectedTab].ingredients.length === 1}
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
                                                setFieldValue(
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
                                <Button type='button' onClick={() => { ingredientHelpers.push({ ..._ingredient }); setFocusLast(true);}}>
                                  add ingredient
                                </Button>
                              </div>
                            )
                          }}
                        </FieldArray>
                      </div>
                    </div>
                  );
                }}
              </FieldArray>
            </section>
        
            <h5>Instructions</h5>
            <section>
              <FieldArray name='instructions'>
                {({ remove, push }) => (
                  <div>
                    {
                      values.instructions.map((instruction, instructionIdx) => (
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
              </FieldArray>
            </section>
            <Button type='button' raised unelevated onClick={() => submitForm()} >Submit</Button>
            </Form>
          </Grid>
        )}
      }
    </Formik>
  </div>
)};

export default RecipeForm;