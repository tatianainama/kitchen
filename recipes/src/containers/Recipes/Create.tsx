import React from 'react';
import  Navbar from 'components/Navbar';
import { Grid, Row, Cell } from '@material/react-layout-grid';

import Input from 'components/Input';
import TagInput from 'components/TagInput';

import './styles.scss';

import sample_img from "../../sample.png";
import { ISubRecipe } from 'src/types/recipes';
import { string } from 'prop-types';

type CreateRecipeProps = {
};

type CreateRecipeState = {
  form: {
    name: string,
    summary: string,
    preparationTime: string,
    cookingTime: string,
    servings: number,
  }

};

// author?: {
//   name: string,
// },
// details?: {
//   preparationTime: string,
//   cookingTime: string,
//   servings: number
// },
// ingredients?: ISubRecipe[],
// instructions?: string[],
// tags?: string[],

type FormKeys = keyof CreateRecipeState['form'];

class CreateRecipe extends React.Component<CreateRecipeProps, CreateRecipeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      form: {
        name: '',
        summary: '',
        preparationTime: '',
        cookingTime: '',
        servings: 0,
      }
    }
  }

  updateField(key: FormKeys) {
    return (e: any) => {
      this.setState({
        form: {
          [key]: e.currentTarget.value
        }
      } as Pick<CreateRecipeState, keyof CreateRecipeState>)
    }
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div>
        <Navbar
          title="Create a recipe"
        />
        
        <div className="cbk-create-recipe">
          <Grid>
            <Row>
              <Cell columns={2}>
                <img src={sample_img} style={{ width: '100%' }}/>
              </Cell>
              <Cell columns={10}>
                <Input 
                  label='name'
                  helperText='Recipe name'
                  value={this.state.form.name}
                  onChange={this.updateField('name')}
                />

                <Input
                  label='summary'
                  helperText='Recipe description'
                  value={this.state.form.summary}
                  onChange={this.updateField('summary')}
                  textarea
                />
              </Cell>
            </Row>

            <h5>Recipe Information</h5>
            <Row>
              <Cell columns={3}>
                <Input
                  label='Preparation time'
                  value={this.state.form.preparationTime}
                  onChange={this.updateField('preparationTime')}
                />
              </Cell>
              <Cell columns={3}>
                <Input
                  label='Preparation time'
                  value={this.state.form.cookingTime}
                  onChange={this.updateField('cookingTime')}
                />
              </Cell>
              <Cell columns={3}>
                <Input
                  label='Preparation time'
                  value={this.state.form.servings}
                  onChange={this.updateField('servings')}
                />
              </Cell>
              <Cell columns={3}>
              </Cell>
              <Cell columns={12}>
                <TagInput
                  onNewTag={(tag) => { console.log(tag) }}
                />
              </Cell>
            </Row>
            <Row>
            </Row>
          </Grid>
        </div>

      </div>
    )
  }
}

export default CreateRecipe;