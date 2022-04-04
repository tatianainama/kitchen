import { FC } from 'react';
import Layout from '@/components/Layout';
import { RecipeTypes } from 'additional';
import iconClear from '@/components/Icons/clear.svg';

import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
  useFieldArray,
  useWatch
} from 'react-hook-form';

type ScrapeInput = {
  url: string;
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
        className="text-xs tracking-wide ring-2 ring-grey-100 bg-grey-100 p-2 w-1/3 focus:outline-none focus:ring-black"
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
        <div key={field.id} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            placeholder="group"
            className="input w-full sm:w-2/12"
            {...register(`ingredients.${index}.group` as const)}
          />
          <input
            placeholder="qty"
            className="input w-full sm:w-1/12"
            {...register(`ingredients.${index}.quantity` as const)}
          />
          <input
            placeholder="unit"
            className="input w-full sm:w-1/12"
            {...register(`ingredients.${index}.unit` as const)}
          />
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
            className="focus:focus"
            tabIndex={-1}
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
              unit: '',
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
            { group: '', quantity: '', unit: '', ingredient: '', note: '' },
            { focusName: `ingredients.${fields.length}.group` }
          );
        }}
      >
        Add new Group
      </button>
    </fieldset>
  );
};
    }
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
          unit: '',
          ingredient: ''
        }
      ],
      instructions: ['']
    }
  });

  const onSubmit: SubmitHandler<RecipeTypes.RecipeInput> = (data) => {
    console.log(data);
  };

  return (
    <Layout>
      <div className="bg-grey-50">
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
              <legend>Author</legend>
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
                <legend>Prep. time</legend>
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
                <legend>Cook time</legend>
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
                <label htmlFor="yields" className="block">
                  Yields
                </label>
                <input
                  type="number"
                  className="input w-full"
                  {...methods.register('yields')}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="servings" className="block">
                  Servings
                </label>
                <input
                  className="input w-full"
                  placeholder="2 people"
                  {...methods.register('serves')}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block">Tags</label>
              <div className="flex">
                <input type="text" className="input md:w-2/12" />
              </div>
            </div>
            <div className="">
              <label className="block">Course</label>
              <div className="flex">
                <input type="text" className="input md:w-2/12" />
              </div>
            </div>
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Ingredients</h2>
            <IngredientInputs />
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Instructions</h2>
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
