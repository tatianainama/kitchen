import durationInMinutes from '@/utils/duration';
import { RecipeTypes } from 'additional';
import Link from 'next/link';
import { FC } from 'react';

const RecipeCard: FC<{ recipe: RecipeTypes.Recipe; className?: string }> = ({
  className,
  recipe
}) => {
  return (
    <div className={`border-2 bg-white flex flex-col ${className}`}>
      <div
        style={{ backgroundImage: `url(/uploads/${recipe.image})` }}
        className="h-48 bg-cover w-full bg-center border-b-2"
      ></div>
      <div className="relative flex flex-col flex-1">
        {recipe.tags?.length ? (
          <ul className="flex absolute top-0 left-0 -translate-y-1/2 w-full px-4 gap-2">
            {recipe.tags.slice(0, 3).map((tag) => (
              <li
                title={tag.name}
                className="border border-black text-overline bg-primary py-1.5 px-2 shadow-strong-small overflow-hidden text-ellipsis whitespace-nowrap"
                key={tag.id}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        ) : null}
        <header className="p-4 py-6 flex flex-col flex-1 gap-2">
          <h4 className="flex-1 flex items-center">
            <Link href={`/recipes/${recipe.slug}`}>
              <a>{recipe.name}</a>
            </Link>
          </h4>
          <a href={recipe.url}>{recipe.author.name}</a>
          <ul className="flex text-xs text-center justify-between">
            <li>
              <span className="block">Prep time</span>
              <strong>{durationInMinutes(recipe.prepTime)} mins</strong>
            </li>
            <li>
              <span className="block">Cook time</span>
              <strong>{durationInMinutes(recipe.cookTime)} mins</strong>
            </li>
            <li>
              <span className="block">Yields</span>
              <strong>{recipe.yields}</strong>
            </li>
          </ul>
        </header>
      </div>
    </div>
  );
};

export default RecipeCard;
