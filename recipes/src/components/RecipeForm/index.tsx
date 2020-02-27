import React, { useState, forwardRef } from 'react';

import Recipe, { Ingredient, Suggestion, _ingredient, _subRecipe, DBRecipe } from 'types/recipes';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import { Field, FieldArray, Formik, useField, Form, FieldArrayRenderProps } from 'formik';
import { MeasuresTypes } from 'services/measurements';
import { Input, Textarea, ControlledInput } from 'components/Input';

import ImageUploader from 'components/ImageUploader';
import Button from 'components/Button';
import Dialog from 'components/DialogConverter';
import TagInput from 'components/TagInput';
import DurationPicker from 'components/DurationPicker';

import './styles.scss';

type RecipeFormProps<T> = {
  initialValues: T,
  onSubmit: (data: T) => void,
  onCancel: () => void,
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

const RecipeForm = <T extends Recipe|DBRecipe>({ initialValues, onSubmit, onCancel}: RecipeFormProps<T>) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [focusLast, setFocusLast] = useState(false);
  return (
  <div>
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {
        ({setFieldValue, submitForm, values}) => {
          return (
          <Grid>
            <Form className='cbk-recipe-form' encType="multipart/form-data">
            <Row>
              <Cell columns={2}>
                <ImageUploader
                  initialValue={initialValues.image}
                  onChange={(image)=> {
                    setFieldValue('image', image)
                  }}
                />
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
                <Cell columns={2}>
                  <DurationPicker
                    initialValue={values.details.preparationTime}
                    onChange={(duration)=>{ setFieldValue('details.preparationTime', duration)}} 
                    label='preparation time'
                  />
                </Cell>
                <Cell columns={2}>
                  <DurationPicker
                    initialValue={values.details.cookingTime}
                    onChange={(duration)=>{ setFieldValue('details.cookingTime', duration)}} 
                    label='cooking time'
                  />
                </Cell>
                <Cell columns={2}>
                  <FormikInput name='details.servings' label='servings' type='number' />
                </Cell>
                <Cell columns={3}>
                  <FormikInput name='details.url' label='recipe url' />
                </Cell>
                <Cell columns={3}>
                  <FormikInput name='details.video' label='recipe video' />
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
                    onNewTag={(dishCourse) => setFieldValue('course', dishCourse)}
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
                              onClick={()=> setSelectedTab(subrecipeIdx)}
                            >
                              <div className='tab__content'> 
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
                        <div className='ingredients-form__header'>
                          <div>ingredient name</div>
                          <div>quantity</div>
                          <div>unit</div>
                          <div>notes</div>
                          <div>original</div>
                        </div>
                        <div className="ingredients-form__content">
                          <FieldArray name={`ingredients[${selectedTab}].ingredients`}>
                            { (ingredientHelpers: any) => {
                              return (
                                <>
                                  {
                                    values.ingredients[selectedTab] && values.ingredients[selectedTab].ingredients.map((ingredient, index, array) => (
                                      <div className='ingredients-form__content__item' key={index}>
                                        <FormikFocusInput name={`ingredients[${selectedTab}].ingredients[${index}].name`} 
                                          ref={(ref: any) => {
                                            if(index === array.length-1 && ref && focusLast) {
                                              ref.focus();
                                              setFocusLast(false);
                                            }
                                          }}
                                          key={index}
                                        />
                                        
                                        <div>
                                          <FormikInput name={`ingredients[${selectedTab}].ingredients[${index}].quantity`} type='number'/>
                                          {ingredient.unit && ingredient.quantity ? (
                                            <Dialog
                                              measure={{unit: ingredient.unit, quantity: ingredient.quantity}}
                                              onConvert={result => ingredientHelpers.replace(index, { ...ingredient, ...result })}
                                            />
                                          ): null}
                                        </div>
                                        
                                        <Field component='select' name={`ingredients[${selectedTab}].ingredients[${index}].unit`}>
                                          <option value=''></option>
                                          {
                                            MeasuresTypes.map((measure, measureIdx) => (
                                              <option key={measureIdx} value={measure}>{measure}</option>    
                                            ))
                                          }
                                        </Field>  
                                        
                                        <FormikInput name={`ingredients[${selectedTab}].ingredients[${index}].notes`}/>
                                        
                                        <FormikInput name={`ingredients[${selectedTab}].ingredients[${index}]._original`} disabled/>
                                        
                                        <Button
                                          type='button'
                                          icon='clear'
                                          onClick={() => {
                                            ingredientHelpers.remove(index)
                                          }}
                                          disabled={values.ingredients[selectedTab].ingredients.length === 1}
                                          small
                                        />
                                        <div className='ingredient-suggestions'>
                                          {
                                            ingredient.suggestions && ingredient.suggestions.map((suggestion, sugIdx) => (
                                              <Button
                                                className='suggestion'
                                                type='button'
                                                key={sugIdx}
                                                onClick={() => {
                                                  setFieldValue(
                                                    `ingredients[${selectedTab}].ingredients[${index}]`,
                                                    convertIngredient(ingredient, suggestion)
                                                  )
                                                }}
                                              >{suggestion.name}</Button>
                                            ))
                                          }
                                        </div>
                                      </div>
                                    ))
                                  }
                                  <div className='ingredients-form__content__actions'>
                                    <Button type='button' unelevated onClick={() => { ingredientHelpers.push({ ..._ingredient }); setFocusLast(true);}}>
                                      add ingredient
                                    </Button>
                                  </div>
                                </>
                              )
                            }}
                          </FieldArray>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </FieldArray>
            </section>
        
            <h5>Instructions</h5>
            <section className='instructions-set'>
              <FieldArray name='instructions'>
                {({ remove, push }) => (
                  <>
                    {
                      values.instructions.map((instruction, instructionIdx) => (
                        <div key={instructionIdx}>
                          <div className='instructions-set__text'>
                            <div className='instructions-set__text__number'>
                            {instructionIdx + 1}
                            </div>
                            <FormikTextarea name={`instructions[${instructionIdx}]`}/>
                          </div>
                          <div className='instructions-set__action'>
                            <Button icon='clear' onClick={() => remove(instructionIdx)} small></Button>
                          </div>
                        </div>
                      ))
                    }
                    <Button type="button" onClick={() => push('')} unelevated>Add instruction</Button>
                  </>
                )}
              </FieldArray>
            </section>
            
            <section className='actions'>
              <Button type='button' outlined onClick={() => onCancel()}>Cancel</Button>
              <Button type='button' raised unelevated onClick={() => submitForm()}>Submit</Button>
            </section>
            </Form>
          </Grid>
        )}
      }
    </Formik>
  </div>
)};

export default RecipeForm;