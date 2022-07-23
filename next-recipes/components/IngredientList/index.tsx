import React, { FC, useMemo } from 'react';
import { RecipeTypes } from 'additional';

type IngredientListProps = {
  recipe: RecipeTypes.Recipe;
};

type IngredientGroup = {
  [key: string]: RecipeTypes.Ingredient[];
};

const ingredientsByGroup = (
  ingredientList: IngredientListProps['recipe']['ingredients']
): IngredientGroup =>
  ingredientList.reduce(
    (groups, { group, ...ingredient }) => ({
      ...groups,
      [group]: [...(groups[group] || []), ingredient]
    }),
    {}
  );

const IngredientList: FC<IngredientListProps> = ({ recipe }) => {
  const groupedList = useMemo(
    () => ingredientsByGroup(recipe.ingredients),
    [recipe.ingredients]
  );

  return (
    <React.Fragment>
      {Object.entries(groupedList).map(([groupName, ingredients]) => (
        <React.Fragment key={groupName}>
          {groupName && (
            <h6 className="text-lg mt-6 first-of-type:mt-0">{groupName}</h6>
          )}
          <ul className="text-sm leading-relaxed mb-6">
            {ingredients.map(({ id, quantity, unit, ingredient, note }) => (
              <li key={id} className="py-1">
                {quantity} {unit}{' '}
                <span className="font-semibold">{ingredient}</span>{' '}
                {note && <span className="text-grey-500">{note}</span>}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default IngredientList;
