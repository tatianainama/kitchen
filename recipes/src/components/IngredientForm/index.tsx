import React from 'react';
import Input from 'components/Input';
import Select from 'components/Select';
import List, {ListItem, ListItemText} from '@material/react-list';
import { TabBar } from 'components/TabBar';

import IRecipe, { ISubRecipe, IAuthor, IDetails, _recipe, _subRecipe, _ingredient, IIngredient, ISuggestion } from 'types/recipes';

import '@material/react-list/dist/list.min.css';
import './styles.scss';
import MaterialIcon from '@material/react-material-icon';

type IngredientFormProps = {
  components: ISubRecipe[],
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

  changeTabName = (event: any) => {
    console.log('change', event);
  }

  addTag = () => {
    this.setState({

    })
  }
  render() {
    const {updateField, components, addSubrecipe, updateSubrecipeName, removeSubrecipe} = this.props;
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
        {
          components.map((group, groupIdx) => (
            <div key={groupIdx} className='cbk-ingredients-component'>
              {/* <Input
                label='group name'
                value={group.name}
                onChange={updateField(['ingredients', groupIdx, 'name'])}
              /> */}
              <div className='cbk-ingredients-component-list'>
                <div className='cbk-ingredients-component-header'>
                  <div className='cbk-title'>Ingredient Name</div>
                  <div className='cbk-title'>Quantity</div>
                  <div className='cbk-title'>Unit</div>
                  <div className='cbk-title'>Notes</div>
                  <div className='cbk-title'>Original</div>
                </div>
                {
                  group.ingredients.map((ingredient, ingredientIdx) => (
                    <div className='cbk-ingredients-component-item' key={ingredientIdx}>
                      <Input
                        label=''
                        value={ingredient.name}
                        onChange={updateField(['ingredients', groupIdx, 'ingredients', ingredientIdx, 'name'])}
                      />
                      <Input
                        label=''
                        value={ingredient.quantity}
                        onChange={updateField(['ingredients', groupIdx, 'ingredients', ingredientIdx, 'quantity'])}
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
                        onChange={updateField(['ingredients', groupIdx, 'ingredients', ingredientIdx, '_original'])}
                      />
                      <Input
                        label=''
                        value={ingredient._original}
                        onChange={updateField(['ingredients', groupIdx, 'ingredients', ingredientIdx, '_original'])}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}

export default IngredientForm;