import { FC, useEffect } from 'react';
import { Recipe } from '@prisma/client';

const InstructionList: FC<{
  instructions: Recipe['instructions'];
}> = ({ instructions }) => {
  useObserver('#instruction-list li > a');
  return (
    <ul id="instruction-list">
      {instructions.map((instruction, index) => {
        const id = index + 1;
        return (
          <li
            key={index}
            id={`step-${id}`}
            className=" flex items-start flex-col mt-4 md:flex-row md:py-1 md:gap-2"
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

const useObserver = (elements: string) => {
  useEffect(() => {
    if (window.screen.width < 905) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('text-primary');
            } else {
              entry.target.classList.remove('text-primary');
            }
          });
        },
        {
          rootMargin: '0px 0px -50% 0px',
          threshold: 1
        }
      );

      document.querySelectorAll(elements).forEach((element) => {
        observer.observe(element);
      });

      return () => observer.disconnect();
    }
  }, []);
};

export default InstructionList;
