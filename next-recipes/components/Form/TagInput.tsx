import { FC } from 'react';
import iconClear from '@/components/Icons/clear.svg';
import { Prisma } from '@prisma/client';

type TagProp = Prisma.TagCreateInput | Prisma.CourseCreateInput;

const TagInput: FC<{
  tags?: TagProp[];
  onChange: (newValue: TagProp[]) => void;
  className?: string;
  label?: string;
  placeholder?: string;
}> = ({ className, tags = [], onChange, label, placeholder }) => {
  const addNewTag = (target: HTMLInputElement) => {
    if (!tags.find((tag) => tag.name === target.value)) {
      onChange([...tags, { name: target.value }]);
    }
    target.value = '';
  };

  const removeItem = (index: number) => {
    const newValues = Array.from(tags);
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className={className}>
      {label && <label className="font-display font-bold block">{label}</label>}
      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <input
          placeholder={placeholder}
          type="text"
          className="input md:w-2/12"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addNewTag(e.target as HTMLInputElement);
            }
          }}
        />
        {tags && tags.length !== 0 && (
          <ul className="flex gap-2 items-center overflow-x-auto">
            {tags.map((tag, index) => (
              <li
                key={tag.name}
                className="bg-secondary-50 text-xs pr-2 py-1 rounded-full flex gap-1 pl-3 items-center"
              >
                <span className="whitespace-nowrap">{tag.name}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="w-3 h-full"
                >
                  <img src={iconClear.src} width={12} height={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagInput;
