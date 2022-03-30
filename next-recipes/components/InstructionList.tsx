import { FC } from 'react';
import { Recipe } from '@prisma/client';

const InstructionList: FC<{
  instructions: Recipe['instructions'];
}> = ({ instructions }) => {
  return (
    <ul id="instruction-list">
      {instructions.map((instruction, index) => {
        const id = index + 1;
        return (
          <li
            key={index}
            id={`step-${id}`}
            className="flex items-start flex-col mt-4 first:mt-0 md:flex-row md:py-1 md:gap-2"
          >
            <a
              href={`#step-${id}`}
              className="font-display font-bold text-grey-500 text-xl leading-snug"
            >
              {`${id.toLocaleString('en-US', {
                minimumIntegerDigits: 2
              })}.`}
            </a>
            <span>{instruction}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default InstructionList;
