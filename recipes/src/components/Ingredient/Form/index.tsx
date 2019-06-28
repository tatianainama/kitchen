import React from 'react';
import Input from 'components/Input';
import Select from 'components/Select';
import TabBar from 'components/TabBar';
import Suggestions from 'components/Ingredient/Suggestions';

import { SubRecipe, _recipe, _subRecipe, _ingredient } from 'types/recipes';

import './styles.scss';

type IngredientFormProps = {
  components: SubRecipe[],
  updateField: (key: any[]) => (e: any) => void,
  addSubrecipe: () => void,
  updateSubrecipeName: (subrecipe: number, newValue: string) => void,
  removeSubrecipe: (index: number) => void,
  updateIngredientUnit: (key: Array<string|number>, newValue: string) => void,
};

type SelectOption = {
  label: string,
  value: string,
}

type IngredientFormState = {
  activeGroup: number,
  unitOptions: SelectOption[],
  normalizeUnits: any,
}

class IngredientForm extends React.Component<IngredientFormProps, IngredientFormState>{

  constructor(props: IngredientFormProps) {
    super(props);
    this.state = {
      unitOptions: [
        { label: 'gr', value: 'gr'},
        { label: 'cup', value: 'cup'},
        { label: 'tbsp', value: 'tbsp'},
        { label: 'tsp', value: 'tsp'},
        { label: 'stick', value: 'stick'},
        { label: 'ml', value: 'ml'},
        { label: 'oz', value: 'oz'},
        { label: 'lb', value: 'lb'},
      ],
      activeGroup: 0,
      normalizeUnits: {
        tablespoon: 'tbsp',
        teaspoon: 'tsp',
        pound: 'lb',
        ounce: 'oz'
      }
    };

  }

  handleActiveIndexUpdate = (activeGroup: number) => this.setState({ activeGroup })
  
  normalizeUnits = (unit: string): string => this.state.normalizeUnits[unit] || unit;
  
  onChangeUnit = (key: Array<string|number>) =>
    (selection: SelectOption) => this.props.updateIngredientUnit(key, selection.value);

  render() {
    const {updateField, components, addSubrecipe, updateSubrecipeName, removeSubrecipe } = this.props;
    const { activeGroup, unitOptions, normalizeUnits } = this.state;
    const tabs = components.map(group => group.name);
    return (
      <div className='cbk-ingredient-form'>
        <div className='cbk-ingredients-subrecipe-list'>
          <TabBar
            tabs={tabs}
            onAddTab={addSubrecipe}
            onUpdateTab={updateSubrecipeName}
            onDeleteTab={removeSubrecipe}
            onSelectTab={this.handleActiveIndexUpdate}
            activeIndex={this.state.activeGroup}
          />
        </div>
        <div className='cbk-ingredients-component'>
          <div className='cbk-ingredients-component-header'>
            <span>Ingredient Name</span>
            <span>Quantity</span>
            <span>Unit</span>
            <span>Notes</span>
            <span>Original</span>
          </div>
          {
            components[activeGroup].ingredients.map((ingredient, index) => (
              <div key={index}>
                <div className='cbk-ingredients-component-item'>
                  <Input
                    label=''
                    value={ingredient.name}
                    onChange={updateField(['ingredients', activeGroup, 'ingredients', index, 'name'])}
                  />
                  <Input
                    label=''
                    value={ingredient.quantity}
                    onChange={updateField(['ingredients', activeGroup, 'ingredients', index, 'quantity'])}
                  />
                  <Select
                    label=''
                    value={this.normalizeUnits(ingredient.unit)}
                    options={unitOptions}
                    onChange={this.onChangeUnit(['ingredients', activeGroup, 'ingredients', index, 'unit'])}
                  />
                  <Input
                    label=''
                    value={''}
                    onChange={updateField(['ingredients', activeGroup, 'ingredients', index, 'notes'])}
                  />
                  <Input
                    label=''
                    value={ingredient._original}
                    onChange={updateField(['ingredients', activeGroup, 'ingredients', index, '_original'])}
                  />
                </div>
                <Suggestions
                  suggestions={ingredient.suggestions}
                  onSelect={(idx) => console.log('selected', idx)}
                  onNew={()=>{}}
                />
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default IngredientForm;