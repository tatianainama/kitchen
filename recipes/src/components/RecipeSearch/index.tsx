import React from 'react';
import { DBRecipe } from 'types/recipes';

import { Input } from 'components/Input';
import List from 'components/List';

import { getRecipes } from 'containers/Recipes/services';
import { throttle } from 'throttle-debounce';

import './styles.scss';

enum Key {
  Down = 40,
  Up = 38,
  Enter = 13,
  Esc = 27
}

type Props = {
  onSelect: (selected: DBRecipe) => void
}

type State = {
  results: DBRecipe[],
  search: string,
  cursor: number,
  selected?: DBRecipe,
  openResult: boolean,
}

class RecipeSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      results: [],
      search: '',
      cursor: 0,
      openResult: false 
    }
  }

  autocompleteSearch = throttle(500, (query: string) => {
    getRecipes(query).then(results => this.setState({results}))
  })

  incrementCursor = () => this.state.results.length && this.state.cursor < (this.state.results.length - 1) ? this.state.cursor + 1 : 0;

  decrementCursor = () => this.state.results.length && this.state.cursor > 0 ? this.state.cursor - 1 : (this.state.results.length - 1);

  onKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === Key.Down) {
      const cursor = this.incrementCursor();
      this.setState({
        selected: this.state.results[cursor],
        cursor: cursor,
      });
    }
    if (event.keyCode === Key.Up) {
      const cursor = this.decrementCursor();
      this.setState({
        selected: this.state.results[cursor],
        cursor: cursor,
      });
    }

    if (event.keyCode === Key.Enter) {
      const selectedRecipe = this.state.results[this.state.cursor];
      this.selectRecipe(selectedRecipe || this.state.search);
    }

    if (event.keyCode === Key.Esc) {
      this.setState({
        openResult: false
      })
    }
  }
  
  selectRecipe = (recipe: DBRecipe) => {
    this.props.onSelect(recipe);
    this.setState({
      openResult: false,
      search: ''
    })
  }

  changeQuery = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: event.currentTarget.value,
      openResult: true,
    }, () => {
      this.autocompleteSearch(this.state.search)
    })
  }

  closeResults = (event: any) => {
    this.setState({
      openResult: false
    })
  }

  toggleResults = (visibility: boolean) => (event: any) => {
    this.setState({
      openResult: visibility
    })
  }

  render() {
    const { results, search, cursor, openResult } = this.state;
    return (
    <div className='cbk-recipe-search'>
      <Input
        className='cbk-recipe-search__input'
        value={search}
        onChange={this.changeQuery}
        onKeyDown={this.onKeyDown}
        onBlur={this.toggleResults(false)}
        onFocus={this.toggleResults(true)}
      />
        {
          results.length && openResult ? (
            <List
              items={results.map((recipe, i) => ({
                children: (
                  <div 
                    className="cbk-recipe-search__results__item" title={recipe.name}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    { recipe.name }
                  </div>
                ),
                selected: cursor === i
              }))}
              onAction={(e) => this.selectRecipe(results[e.detail.index])}
              dense
              className="cbk-recipe-search__results"
            >

            </List>
          ) : null
        }
    </div>
    )
  }    
}

export default RecipeSearch