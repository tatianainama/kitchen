import React from 'react';
import Input from 'components/Input';
import Select from 'components/Select';
import TabBar from 'components/TabBar';

import { SubRecipe, _recipe, _subRecipe, _ingredient } from 'types/recipes';

import './styles.scss';

type IngredientFormProps = {
  components: SubRecipe[],
  updateField: (key: any[]) => (e: any) => void,
  addSubrecipe: () => void,
  updateSubrecipeName: (subrecipe: number, newValue: string) => void,
  removeSubrecipe: (index: number) => void,
};

class IngredientForm extends React.Component<IngredientFormProps, { activeGroup: number }>{

  constructor(props: IngredientFormProps) {
    super(props);
    this.state = {
      activeGroup: 0,
    };
  }

  handleActiveIndexUpdate = (activeGroup: number) => this.setState({ activeGroup })

  render() {
    const {updateField, components, addSubrecipe, updateSubrecipeName, removeSubrecipe} = this.props;
    const {activeGroup} = this.state;
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
              <div className='cbk-ingredients-component-item' key={index}>
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
                  options={[
                    {label: 'grams', value: 'gr'},
                    {label: 'cups', value: 'cup'},
                    {label: 'mililiters', value: 'ml'},
                  ]}
                  onChange={(x) => {console.log('selected', x)}}
                />
                <Input
                  label=''
                  value={''}
                  onChange={updateField(['ingredients', activeGroup, 'ingredients', index, '_original'])}
                />
                <Input
                  label=''
                  value={ingredient._original}
                  onChange={updateField(['ingredients', activeGroup, 'ingredients', index, '_original'])}
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