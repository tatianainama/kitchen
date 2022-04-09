import { FC } from 'react';
import Layout from '@/components/Layout';
import { RecipeTypes } from 'additional';
import iconClear from '@/components/Icons/clear.svg';

import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
  useFieldArray
} from 'react-hook-form';
import { UnitName } from '@prisma/client';

type ScrapeInput = {
  url: string;
};

const TagInput: FC<{
  field: 'course' | 'tags';
  className?: string;
  label?: string;
  placeholder?: string;
}> = ({ className, field, label, placeholder }) => {
  const { setValue, watch } = useFormContext<RecipeTypes.RecipeInput>();
  const tags = watch(field);

  const addNewTag = (target: HTMLInputElement) => {
    setValue(field, Array.from(new Set([...tags, target.value])));
    target.value = '';
  };

  const removeItem = (index: number) => {
    const newValues = Array.from(tags);
    newValues.splice(index, 1);
    setValue(field, newValues);
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
        {tags.length !== 0 && (
          <ul className="flex gap-2 items-center overflow-x-auto">
            {tags.map((tag, index) => (
              <li
                key={tag}
                className="bg-secondary-50 text-xs pr-2 py-1 rounded-full flex gap-1 pl-3 items-center"
              >
                <span className="whitespace-nowrap">{tag}</span>
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

const ScrapeRecipeForm: FC<{
  setScrapedRecipe: (recipe: RecipeTypes.ScrapedRecipe) => void;
  className: string;
}> = ({ setScrapedRecipe, className }) => {
  const { register, handleSubmit } = useForm<ScrapeInput>();

  const scrapeData: SubmitHandler<ScrapeInput> = async (data) => {
    try {
      const result = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.url })
      }).then((response) => response.json());
      setScrapedRecipe(result);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(scrapeData)} className={className}>
      <input
        className="text-xs tracking-wide ring-2 ring-grey-50 bg-grey-50 p-2 w-1/3 focus:outline-none focus:ring-black"
        {...register('url', { required: true })}
      />
      <button type="submit" className="btn-outline bg-white">
        Scrape
      </button>
    </form>
  );
};

const IngredientInputs: FC = () => {
  const { control, register, watch } =
    useFormContext<RecipeTypes.RecipeInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  });
  const watchFields = watch('ingredients');
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFields[index]
  }));

  return (
    <fieldset>
      {controlledFields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-wrap sm:flex-nowrap sm:flex-row gap-2 mb-4"
        >
          <input
            placeholder="group"
            className="input w-full sm:w-2/12"
            {...register(`ingredients.${index}.group` as const)}
          />
          <input
            placeholder="qty"
            className="input flex-1 sm:flex-auto sm:w-1/12"
            {...register(`ingredients.${index}.quantity` as const)}
          />
          <select
            placeholder="unit"
            className="input flex-1 sm:flex-auto sm:w-1/12"
            defaultValue=""
            {...register(`ingredients.${index}.unit` as const)}
          >
            <option value="" disabled>
              unit
            </option>
            {Object.values(UnitName).map((unit) => (
              <option key={unit} value={unit}>
                {unit.replace('_', ' ')}
              </option>
            ))}
          </select>
          <input
            placeholder="name"
            className="input w-full sm:w-4/12"
            {...register(`ingredients.${index}.ingredient` as const, {
              required: true
            })}
          />
          <input
            placeholder="note"
            className="input w-full sm:w-4/12"
            {...register(`ingredients.${index}.note` as const)}
          />
          <button
            type="button"
            className="disabled:opacity-30"
            tabIndex={-1}
            disabled={fields.length === 1}
            onClick={() => remove(index)}
          >
            <img src={iconClear.src} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-outline"
        onClick={() => {
          append(
            {
              group: fields.slice(-1)[0].group,
              quantity: '',
              unit: null,
              ingredient: '',
              note: ''
            },
            { focusName: `ingredients.${fields.length}.quantity` }
          );
        }}
      >
        Add new
      </button>
      <button
        type="button"
        className="btn-outline"
        onClick={() => {
          append(
            {
              group: '',
              quantity: '',
              unit: null,
              ingredient: '',
              note: ''
            },
            { focusName: `ingredients.${fields.length}.group` }
          );
        }}
      >
        Add new Group
      </button>
    </fieldset>
  );
};

const InstructionsInputs: FC = () => {
  const { register } = useFormContext<RecipeTypes.RecipeInput>();

  const { fields, append, remove } = useFieldArray({ name: 'instructions' });

  return (
    <fieldset>
      {fields.map(({ id }, index) => (
        <div key={id} className="flex gap-2 mb-4">
          <textarea
            rows={2}
            className="input w-full"
            {...register(`instructions.${index}` as const)}
          />
          <button
            type="button"
            className="disabled:opacity-30"
            tabIndex={-1}
            disabled={fields.length === 1}
            onClick={() => remove(index)}
          >
            <img src={iconClear.src} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-outline"
        onClick={() =>
          append('', { focusName: `instructions.${fields.length}` })
        }
      >
        Add new
      </button>
    </fieldset>
  );
};

const CreateRecipe: FC = () => {
  const methods = useForm<RecipeTypes.RecipeInput>({
    defaultValues: {
      name: '',
      summary: '',
      url: '',
      slug: '',
      prepTime: '',
      cookTime: '',
      yields: 0,
      serves: '',
      tags: [],
      course: [],
      ingredients: [
        {
          group: '',
          quantity: '',
          unit: null,
          ingredient: ''
        }
      ],
      instructions: [' ']
    }
  });

  const onSubmit: SubmitHandler<RecipeTypes.RecipeInput> = (data) => {
    console.log(data);
  };

  return (
    <Layout>
      <div className="bg-white border-b-2 border-grey-200">
        <ScrapeRecipeForm
          setScrapedRecipe={(scraped) => {
            console.log(scraped);
            methods.reset(scraped);
          }}
          className="layout-container p-4 md:w-with-padding md:px-0 flex gap-2 items-center"
        />
      </div>
      <FormProvider {...methods}>
        <form
          className="layout-container md:w-with-padding md:py-4"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="relative flex flex-col md:flex-row md:border-2 bg-white">
            <div
              id="image-input"
              className="h-48 w-full bg-cover bg-center sm:h-72 sm:border-b-2 md:border-r-2 md:border-b-0 md:h-auto md:min-h-[15rem] md:w-1/4"
            >
              {/* <input
                type="file"
                id="recipe-image"
                accept="image/*"
                className="w-full"
                onChange={onChangeFile}
                ref={fileInput}
              /> */}
            </div>
            <div className="relative py-9 px-4 border-t-2 bg-white sm:-mt-14 sm:w-with-padding sm:border-2 sm:mx-auto md:mt-0 md:border-none md:w-3/4 md:p-6">
              <textarea
                placeholder="Name"
                rows={1}
                className="input font-display font-bold text-h1 p-2 pb-0 w-full mb-4 md:min-h-[4.5rem]"
                {...methods.register('name')}
              ></textarea>
              <textarea
                placeholder="Summary"
                rows={3}
                className="input w-full mb-4 md:min-h-[3.5rem]"
                {...methods.register('summary')}
              ></textarea>
              <div className="flex flex-col md:flex-row gap-4">
                <input placeholder="Recipe url" className="input flex-1" />
                <input
                  placeholder="Slug"
                  className="input flex-1"
                  {...methods.register('slug')}
                />
              </div>
            </div>
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Details</h2>
            <fieldset name="author">
              <legend className="font-display font-bold">Author</legend>
              <div className="flex flex-col gap-4 md:flex-row mb-4">
                <input
                  id="recipe-author"
                  name="author-name"
                  type="text"
                  className="input flex-1"
                  placeholder="Name"
                />
                <input
                  id="recipe-author-website"
                  className="input flex-1"
                  placeholder="Website"
                />
              </div>
            </fieldset>
            <div className="flex flex-col gap-4 md:flex-row mb-4">
              <fieldset name="prep-time" className="flex gap-2 flex-1">
                <legend className="font-display font-bold">Prep. time</legend>
                <input
                  id="detail-prep-time-h"
                  name="prep-time-h"
                  type="number"
                  min={0}
                  max={60}
                  className="input flex-1"
                  placeholder="h"
                />
                <input
                  id="detail-prep-time-m"
                  name="prep-time-m"
                  type="number"
                  min={0}
                  max={60}
                  className="input flex-1"
                  placeholder="m"
                />
              </fieldset>
              <fieldset name="cook-time" className="flex gap-2 flex-1">
                <legend className="font-display font-bold">Cook time</legend>
                <input
                  id="detail-cook-time-h"
                  name="cook-time-h"
                  type="number"
                  min={0}
                  max={60}
                  className="input flex-1"
                  placeholder="h"
                />
                <input
                  id="detail-cook-time-m"
                  name="cook-time-m"
                  type="number"
                  min={0}
                  max={60}
                  className="input flex-1"
                  placeholder="m"
                />
              </fieldset>
              <div className="flex-1">
                <label
                  htmlFor="yields"
                  className="font-display font-bold block"
                >
                  Yields
                </label>
                <input
                  type="number"
                  className="input w-full"
                  {...methods.register('yields')}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="servings"
                  className="font-display font-bold block"
                >
                  Servings
                </label>
                <input
                  className="input w-full"
                  placeholder="2 people"
                  {...methods.register('serves')}
                />
              </div>
            </div>
            <TagInput
              className="mb-4"
              field="tags"
              label="Tags"
              placeholder="mexican"
            />
            <TagInput field="course" label="Course" placeholder="dessert" />
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Ingredients</h2>
            <IngredientInputs />
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Instructions</h2>
            <InstructionsInputs />
          </div>
          <div className="border-t-2 flex flex-col sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6 md:flex-row ">
            <button type="reset" className="btn-outline">
              Reset
            </button>
            <button type="submit" className="btn-default">
              Save
            </button>
          </div>
        </form>
      </FormProvider>
      {/* {postResult && <pre>{JSON.stringify(postResult, null, 2)}</pre>} */}
      {/* {scrapedRecipe && <pre>{JSON.stringify(scrapedRecipe, null, 2)}</pre>} */}
    </Layout>
  );
};

export default CreateRecipe;
