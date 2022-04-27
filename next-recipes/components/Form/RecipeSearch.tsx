import { RecipeTypes } from 'additional';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import FilterIcon from '@/components/Icons/filter.svg';
import SearchIcon from '@/components/Icons/search.svg';

type SearchFormType = { name: string; tags: string[]; courses: string[] };

const Search: FC<Pick<RecipeTypes.Recipe, 'tags' | 'courses'>> = ({
  tags,
  courses
}) => {
  const router = useRouter();
  const [showAdvanced, toggleAdvanced] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<SearchFormType>({
    defaultValues: {
      name: '',
      tags: [],
      courses: []
    }
  });

  const submit: SubmitHandler<SearchFormType> = (data, event) => {
    event.preventDefault();
    router.push({
      query: data
    });
  };

  return (
    <form className="container" onSubmit={handleSubmit(submit)}>
      <div className="flex gap-4 md:gap-5">
        <input
          type="text"
          className="input flex-1 h-9"
          placeholder="Search"
          {...register('name')}
        />
        <div className="flex gap-2">
          <button
            className={`btn-outline flex gap-2 items-center ${
              showAdvanced
                ? 'bg-secondary-100 hover:bg-secondary-100 active:bg-secondary-100 focus:bg-secondary-100'
                : 'bg-white'
            }`}
            type="button"
            onClick={() => toggleAdvanced(!showAdvanced)}
          >
            <img width={24} height={24} src={FilterIcon.src} />
            <span className="hidden invisible md:block md:visible">
              Advanced
            </span>
          </button>
          <button className="btn-default flex gap-2 items-center" type="submit">
            <img
              width={24}
              height={24}
              src={SearchIcon.src}
              className="invert"
            />
            <span className="hidden invisible md:block md:visible">search</span>
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all h-full ${
          showAdvanced ? 'max-h-96' : 'max-h-0'
        }`}
      >
        {tags.length ? (
          <fieldset className="min-w-0 mt-4">
            <legend className="font-display font-bold md:block">Tags</legend>
            <div className="overflow-x-auto overflow-y-hidden flex gap-2">
              {tags.map((tag) => (
                <label
                  htmlFor={tag.name}
                  key={tag.name}
                  className="cursor-pointer mb-2 inline"
                >
                  <input
                    type="checkbox"
                    value={tag.name}
                    id={tag.name}
                    className="appearance-none h-0 w-0 peer"
                    {...register('tags')}
                  />
                  <span className="inline border border-black text-overline bg-white py-1.5 px-2 hover:bg-grey-50 peer-checked:bg-primary font-normal select-none whitespace-nowrap">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        {courses.length ? (
          <fieldset className="min-w-0 mt-2">
            <legend className="font-display font-bold md:block">Course</legend>
            <div className="overflow-x-auto overflow-y-hidden flex gap-2">
              {courses.map((course) => (
                <label
                  htmlFor={course.name}
                  key={course.name}
                  className="cursor-pointer mb-2 inline"
                >
                  <input
                    type="checkbox"
                    value={course.name}
                    id={course.name}
                    className="appearance-none h-0 w-0 peer"
                    {...register('courses')}
                  />
                  <span className="inline border border-black text-overline bg-white py-1.5 px-2 hover:bg-grey-50 peer-checked:bg-primary font-normal select-none whitespace-nowrap">
                    {course.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>
    </form>
  );
};

export default Search;
