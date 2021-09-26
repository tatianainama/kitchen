import {FC, MouseEventHandler} from "react";
import Heart from "@/components/Icon/heart";
import Image from "next/image";
import {Recipe} from "@/types/recipes";
import {Subtitle} from "@/components/Typography";
import Time from "../Icon/time";

import classNames from "classnames";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./RecipeItem.module.css";

dayjs.extend(duration);
dayjs.extend(relativeTime);

type RecipeItemProps = {
  tagName?: keyof JSX.IntrinsicElements,
  onClick?: MouseEventHandler,
  recipe: Recipe,
};

export const RecipeItem: FC<RecipeItemProps> = ({tagName, recipe, onClick}) => {

    const Tag = tagName as keyof JSX.IntrinsicElements,
        cookingTime = recipe.details.cookingTime || recipe.details.preparationTime
            ? dayjs.duration(recipe.details.cookingTime).add(recipe.details.preparationTime).
                humanize()
            : "-";

    return (
        <Tag className={classNames(
            styles.recipeItem,
            {
                [styles.recipeItemClickeable]: Boolean(onClick)
            }
        )} onClick={onClick}>
            <div className={styles.recipeItemMedia}>
                {recipe.image && <Image src={`${process.env.API}/${recipe.image}`} alt={recipe.name} layout="fill" />}
            </div>
            <div className={styles.recipeItemContent}>
                <Subtitle alternative>{recipe.name}</Subtitle>
                <p className={styles.recipeItemContentDescription}>
                    <Time />
                    {cookingTime}
                </p>
            </div>
            <div className={styles.recipeItemAction}>
                <Heart />
            </div>
        </Tag>
    );

};

RecipeItem.defaultProps = {
    "tagName": "div"
};

export default RecipeItem;
