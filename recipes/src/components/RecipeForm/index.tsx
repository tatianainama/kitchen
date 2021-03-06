import React, { useState, forwardRef } from 'react';

import Recipe, { Ingredient, Suggestion, _ingredient, _subRecipe, DBRecipe } from 'types/recipes';
import {
  Grid, 
  GridCell as Cell, 
  GridRow as Row
} from '@rmwc/grid';
import { Field, FieldArray, Formik, useField, Form } from 'formik';
import { MeasuresTypes } from 'services/measurements';
import { Input, Textarea, ControlledInput } from 'components/Input';
import ImageUploader from 'components/ImageUploader';
import Button from 'components/Button';
import DialogConverter from 'components/DialogConverter';
import TagInput from 'components/TagInput';
import DurationPicker from 'components/DurationPicker';
import Dialog from 'components/Dialog';

import '@rmwc/grid/styles';
import './styles.scss';

type RecipeFormProps<T> = {
  initialValues: T,
  onSubmit: (data: T) => void,
  onCancel: () => void,
  onErrors?: () => void,
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
        error={ meta.touched && meta.error ? meta.error : undefined }
        { ...props }
        { ...field }
      />
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
        error={ meta.touched && meta.error ? meta.error : undefined }
        { ...props }
        { ...field }
      />
    </>
  );
});

const FormikTextarea = ({ label, ...props }: FormikInputProps)  => {
  const [field, meta] = useField(props);
  return (
    <>
      <Textarea
        label={label}
        error={ meta.touched && meta.error ? meta.error : undefined }
        { ...props }
        { ...field }
      /> 
    </>
  );
};

const validateRecipe = (recipe: Recipe | DBRecipe): Recipe | DBRecipe => {
  let errors: any = {}

  if (!recipe.name) {
    errors.name = 'recipe must have a name'
  }

  if (!recipe.ingredients[0].ingredients[0].name) {
    errors.ingredients = 'the recipe must have at least one ingredient'
  }

  return errors;
}

const RecipeForm = <T extends Recipe|DBRecipe>({ initialValues, onSubmit, onCancel}: RecipeFormProps<T>) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [focusLast, setFocusLast] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  return (
  <div>
    <Dialog
      isOpen={openDialog}
      actions={{
        cancel: {
          label: 'cancel',
          onSelect: () => setOpenDialog(false),
          isDefault: false
        },
        accept: {
          label: 'accept',
          onSelect: () => {
            setOpenDialog(false);
            onCancel();
          },
          isDefault: true
        },
      }}
    >
      <div>
        Are you sure ?
      </div>
    </Dialog>
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateRecipe}
    >
      {
        ({setFieldValue, submitForm, values, errors}) => {
          return (
          <Form className='cbk-recipe-form' encType="multipart/form-data">
            <Grid>
            <Cell span={2}>
              <ImageUploader
                initialValue={initialValues.image}
                onChange={(image)=> {
                  setFieldValue('image', image)
                }}
              />
            </Cell>
            <Cell span={10}>
              <FormikInput name='name' label='name' />
              <FormikTextarea name='summary' label='summary' />
            </Cell>
            
            <Cell span={12}>
              <h5>Author Information</h5>
              <Row>
                <Cell span={3}>
                  <FormikInput name='author.name' label='name' required/>
                </Cell>
                <Cell span={3}>
                  <FormikInput name='author.website' label='website' />
                </Cell>
              </Row>
            </Cell>
        
            <Cell span={12}>
              <h5>Recipe Information</h5>
              <Row>
                <Cell span={2}>
                  <DurationPicker
                    initialValue={values.details.preparationTime}
                    onChange={(duration)=>{ setFieldValue('details.preparationTime', duration)}} 
                    label='preparation time'
                  />
                </Cell>
                <Cell span={2}>
                  <DurationPicker
                    initialValue={values.details.cookingTime}
                    onChange={(duration)=>{ setFieldValue('details.cookingTime', duration)}} 
                    label='cooking time'
                  />
                </Cell>
                <Cell span={2}>
                  <FormikInput name='details.servings' label='servings' type='number' />
                </Cell>
                <Cell span={3}>
                  <FormikInput name='details.url' label='recipe url' />
                </Cell>
                <Cell span={3}>
                  <FormikInput name='details.video' label='recipe video' />
                </Cell>
                <Cell span={12}>
                  <TagInput
                    tags={values.tags}
                    label='tags'
                    onNewTag={(tags) => setFieldValue('tags', tags)}
                  />
                </Cell>
                <Cell span={12}>
                  <TagInput
                    tags={values.course}
                    label='dish course'
                    onNewTag={(dishCourse) => setFieldValue('course', dishCourse)}
                  />
                </Cell>
              </Row>
            </Cell>

            <Cell span={12}>
              <h5>Ingredients</h5>
              <Cell span={12}>
                <FieldArray name='ingredients'>
                  {({remove, push}) => {
                    return (
                      <>
                      <div className={`subrecipe-tabs${errors.ingredients ? ' subrecipe-tabs--invalid' : ''}`}>
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
                                          <FormikFocusInput name={`ingredients[${selectedTab}].ingredients[${index}].name` } 
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
                                              <DialogConverter
                                                measureName={ingredient.name}
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
                      { errors.ingredients && (
                        <div className="subrecipe-tabs__error"> {errors.ingredients} </div>
                      )}
                      </>
                    );
                  }}
                </FieldArray>
              </Cell>
            </Cell>
        
            <Cell span={12}>
              <h5>Instructions</h5>
              <Cell span={12} className='instructions-set'>
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
              </Cell>
            </Cell>
            
            <Cell span={12} className='actions'>
              <Button type='button' outlined onClick={() => setOpenDialog(true)}>Cancel</Button>
              <Button type='button' raised unelevated onClick={() => submitForm()}>Submit</Button>
            </Cell>
            </Grid>
          </Form>
        )}
      }
    </Formik>
  </div>
)};

export default RecipeForm;