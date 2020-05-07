import React, { useState } from 'react';

import { SubRecipe, Ingredient } from 'src/types/recipes';
import Button from 'components/Button';
import Input from 'components/Input';

import { FormatFloat } from 'services/measurements';
import './styles.scss';

enum MODE {
  Predefined,
  Custom
}
type Props = {
  ingredients: SubRecipe[],
};

const ScaleTool: React.FunctionComponent<Props> = ({ ingredients }) => {
  const [ mode, setMode ] = useState<MODE>(MODE.Predefined);
  const [ multiplier, setMultiplier ] = useState<number>(1);
  const [ stick, setStick ] = useState<{ value: number, key: string, multiplier: number, original: number }>({
    original: 1,
    value: 1,
    key: '',
    multiplier: 1,
  });

  const scales: [number, string][] = [[2, '2'], [1, '1'], [0.5, '1/2'], [0.33, '1/3'], [0.25, '1/4']];

  const changeMultiplier = (multiplier: number, _mode: MODE) => {
    setMode(_mode);
    setMultiplier(multiplier);
  }

  const setStickMultiplier = (newValue: number) => {
    if (!isNaN(newValue)) {
      setStick({
        ...stick,
        value: newValue,
        multiplier: (newValue || 1) / stick.original
      })
    } else {
      setStick({
        ...stick,
        value: newValue,
      })
    }
  }

  const setNewStick = (value: number, key: string) => {
    setStick({
      original: value,
      multiplier: 1,
      value,
      key
    })
  }

  const activeMultiplier = (m: number) => {
    return mode === MODE.Predefined &&  m === multiplier;
  }

  return (
    <div className="cbk-scale-tool">
      <div className="cbk-scale-tool__actions">
        {
          scales.map(([multiplier, label] ) => (
            <Button
              key={multiplier}
              link
              small
              onClick={() => {changeMultiplier(multiplier, MODE.Predefined)}}
              active={activeMultiplier(multiplier)}>
                <span>x{label}</span>
            </Button>
          ))
        }
        <Button link small active={mode === MODE.Custom} onClick={() => { changeMultiplier(1, MODE.Custom) }}>with stick</Button>
      </div>
      <div className="cbk-scale-tool__ingredients">
        {
          ingredients.map((subrecipe, subrecipeKey) => (
            <ul key={subrecipeKey}>
              {
                subrecipe.name ? (
                  <li className="cbk-scale-tool__ingredients__title">{ subrecipe.name }</li>
                ) : null
              }
              {
                subrecipe.ingredients.map((ingredient, ingredientKey) => {
                  const key = `${subrecipeKey}-${ingredientKey}`;
                  return mode === MODE.Predefined ? (
                    (
                      <li key={key}>
                        <IngredientItem ingredient={{
                          ...ingredient,
                          quantity: FormatFloat(ingredient.quantity * multiplier)
                        }}/>
                      </li>
                    )
                  ) : (
                    (
                      <li key={key} onClick={e => {setNewStick(ingredient.quantity, key)}} className={stick.key === key ? 'stick-ingredient' : ''}>
                        {
                          stick.key === key ? (
                            <IngredientItem ingredient={ingredient}>
                              <Input min={1} value={isNaN(stick.value) ? '' : stick.value} style={{width: `${JSON.stringify(stick.value).length + 1}ch`}} type='number' onChange={e => {setStickMultiplier(parseInt(e.currentTarget.value))}}/>
                            </IngredientItem>
                          ) : (
                            <IngredientItem ingredient={{
                              ...ingredient,
                              quantity: FormatFloat(ingredient.quantity * stick.multiplier)
                            }} />
                          )
                        }
                      </li>
                    )
                  )
                })
              }
            </ul>
          ))
        }
      </div>
    </div>
  )
};

const IngredientItem: React.FunctionComponent<{ ingredient: Ingredient }> = ({ ingredient, children }) => {
  return (
    <>
      {
        children ? ( children ) : (
          <div className="cbk-scale-tool__ingredients__qty">
            { ingredient.quantity }
          </div>
        )
      }
      <div className="cbk-scale-tool__ingredients__unit">
        { ingredient.unit }
      </div>
      <div className="cbk-scale-tool__ingredients__name">
        { ingredient.name } <span className="cbk-scale-tool__ingredients__name__notes">{ingredient.notes}</span>
      </div>
    </>
  )
}

export default ScaleTool;