import React, { useState } from 'react';

import { SubRecipe } from 'src/types/recipes';
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

  const humanized = (value: number) => {
    return value.toFixed(2);
  }

  const changeMultiplier = (multiplier: number) => {
    if (mode === MODE.Custom) {
      setMode(MODE.Predefined);
    }
    setMultiplier(multiplier)
  }

  const setStickMultiplier = (newValue: number) => {
    setStick({
      ...stick,
      value: newValue,
      multiplier: (newValue || 1) / stick.original
    })
  }

  const setNewStick = (value: number, key: string) => {
    setStick({
      original: value,
      multiplier: 1,
      value,
      key
    })
  }

  return (
    <div className="cbk-scale-tool">
      <div className="cbk-scale-tool__actions">
        <Button onClick={() => { changeMultiplier(2) }}>x 2</Button>
        <Button onClick={() => { changeMultiplier(1) }}>x 1</Button>
        <Button onClick={() => { changeMultiplier(0.5) }}>x 1/2</Button>
        <Button onClick={() => { changeMultiplier(0.33) }} >x 1/3</Button>
        <Button onClick={() => { changeMultiplier(0.25) }}>x 1/4</Button>
        <Button onClick={() => { setMode(MODE.Custom) }}>with stick</Button>
      </div>
      <div className="cbk-scale-tool__ingredients">
        {
          ingredients.map((subrecipe, subrecipeKey) => (
            <ul key={subrecipeKey}>
              {
                subrecipe.name ? (
                  <li>{ subrecipe.name }</li>
                ) : null
              }
              {
                subrecipe.ingredients.map((ingredient, ingredientKey) => {
                  const key = `${subrecipeKey}-${ingredientKey}`;
                  return mode === MODE.Predefined ? (
                    (
                      <li key={key}>
                        { FormatFloat(ingredient.quantity * multiplier) }{ ingredient.unit } { ingredient.name }
                      </li>
                    )
                  ) : (
                    (
                      <li key={key}>
                        <input type="radio" value={key} checked={stick.key === key} onChange={e => { setNewStick(ingredient.quantity, key)}}/>
                        {
                          stick.key === key ? (
                            <span>
                              <input min={1} value={stick.value} type='number' onChange={e => {setStickMultiplier(parseInt(e.currentTarget.value))}}/>
                              {ingredient.unit} {ingredient.name}
                            </span>
                          ) : (
                            <span>
                              { FormatFloat(ingredient.quantity * stick.multiplier) }{ ingredient.unit } { ingredient.name }
                            </span>
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

export default ScaleTool;