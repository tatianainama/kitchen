import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import iconClear from '@/components/Icons/clear.svg';

type TagProp = { name: string };

const relativeComplement = (xs: TagProp[], ys: TagProp[]) =>
  xs.filter((x) => !ys.some((y) => y.name === x.name));

const TagInput: FC<{
  options: { name: string; id: string }[];
  tags?: TagProp[];
  onChange: (newValue: TagProp[]) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  name: string;
}> = ({
  className,
  tags = [],
  onChange,
  label,
  placeholder,
  options,
  name
}) => {
  const [curatedOptions, setCuratedOptions] = useState([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focusOption, setFocusOption] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    setCuratedOptions(relativeComplement(options, tags));
  }, [options, tags]);

  const addNewTag = (value: string) => {
    if (!tags.find((tag) => tag.name === value)) {
      onChange([...tags, { name: value }]);
    }
  };

  const removeItem = (index: number) => {
    const newValues = Array.from(tags);
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const filterOptions = (filter: string) => {
    const result = curatedOptions.filter((option) =>
      option.name.includes(filter)
    );
    setFilteredOptions(result);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowOptions(true);
    filterOptions(e.target.value);
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setFocusOption(-1);
    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        if (focusOption !== -1) {
          addNewTag(filteredOptions[focusOption].name);
        } else {
          addNewTag(inputRef.current.value);
        }
        inputRef.current.value = '';
        setShowOptions(false);
        break;
      }
      case 'ArrowDown': {
        if (filteredOptions.length === 0) break;
        const nextOption = focusOption + 1;
        if (nextOption < filteredOptions.length) {
          setFocusOption(nextOption);
        } else {
          setFocusOption(0);
        }
        break;
      }
      case 'ArrowUp': {
        const prevOption = focusOption - 1;
        if (prevOption >= -1) {
          setFocusOption(prevOption);
        } else {
          setShowOptions(false);
        }
        break;
      }
      case 'Escape': {
        setShowOptions(false);
        setFocusOption(-1);
        break;
      }
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          className="font-display font-bold block"
          htmlFor={`${name}-input`}
        >
          {label}
        </label>
      )}
      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div
          className="md:w-3/12 pr-2 relative"
          role="combobox"
          aria-expanded={showOptions}
          aria-owns={`${name}-listbox`}
          aria-haspopup="listbox"
        >
          <input
            id={`${name}-input`}
            aria-autocomplete="list"
            aria-controls={`${name}-listbox`}
            ref={inputRef}
            placeholder={placeholder}
            type="text"
            className="input w-full"
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            onFocus={() => setShowOptions(true)}
            onBlur={() => setShowOptions(false)}
            aria-activedescendant={
              focusOption !== -1 ? `option-${focusOption}` : ''
            }
          />
          <ul
            id={`${name}-listbox`}
            className={`absolute w-full inset-0 translate-y-8 bg-white z-10 h-52 overflow-y-auto overflow-x-hidden ${
              showOptions ? 'block' : 'hidden'
            }`}
            role="listbox"
            tabIndex={-1}
          >
            {filteredOptions.map((option, i) => (
              <li
                key={option.id}
                role="option"
                id={`option-${i}`}
                aria-selected={focusOption === i}
                tabIndex={-1}
                className={focusOption === i ? `bg-grey-50` : ``}
                onClick={() => addNewTag(option.name)}
              >
                {option.name}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li aria-disabled="true" tabIndex={-1}>
                No results found
              </li>
            )}
          </ul>
        </div>
        {tags && tags.length !== 0 && (
          <ul
            className="flex gap-2 items-center overflow-x-auto"
            id="option-list"
          >
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
