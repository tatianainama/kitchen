import { FC } from 'react';
import Layout from '@/components/Layout';
import { RecipeTypes } from 'additional';
import iconClear from '@/components/Icons/clear.svg';
import iconRaw from '@/components/Icons/raw.svg';
import DurationInput from '@/components/Form/DurationInput';
import ImageInput from '@/components/Form/ImageInput';
import TagInput from '@/components/Form/TagInput';
import toBase64 from '@/utils/toBase64';
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
  useFieldArray,
  Controller
} from 'react-hook-form';
import prisma from '@/lib/prisma';
import { UnitName } from '@prisma/client';
import { mkDuration } from '@/utils/duration';
import { toast } from 'react-toastify';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

type ScrapeInput = {
  url: string;
};

const INITIAL_STATE: RecipeTypes.RecipeInput = {
  name: '',
  summary: '',
  image: '',
  url: '',
  slug: '',
  prepTime: '',
  cookTime: '',
  yields: 0,
  serves: '',
  tags: [],
  courses: [],
  ingredients: [
    {
      group: '',
      quantity: '',
      unit: null,
      ingredient: '',
      original: '',
      note: ''
    }
  ],
  instructions: [' '],
  author: {
    website: '',
    name: ''
  }
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
      });
      const response = await result.json();
      if (!result.ok) {
        throw new Error(response.error || result.statusText);
      }
      setScrapedRecipe(response);
    } catch (error) {
      toast.error(error.message || error.toString());
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
      <legend className="hidden sm:flex sm:flex-row gap-2 mb-2 mt-4 w-full">
        <span className="font-display font-bold block w-2/12">Group</span>
        <span className="font-display font-bold block w-1/12">Qty</span>
        <span className="font-display font-bold block w-1/12">Unit</span>
        <span className="font-display font-bold block w-4/12">Name</span>
        <span className="font-display font-bold block w-4/12">Notes</span>
        <span
          className={`block ${controlledFields[0]?.original ? 'w-16' : 'w-6'}`}
        ></span>
      </legend>
      {controlledFields.map((field, index) => (
        <div
          key={field.id}
          className="relative flex flex-wrap sm:flex-nowrap sm:flex-row gap-2 mb-4 border-b border-dashed border-grey-500 pb-2 sm:pb-0 sm:border-0"
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
            className="input flex-1 sm:flex-auto sm:w-1/12"
            defaultValue=""
            {...register(`ingredients.${index}.unit` as const)}
          >
            <option value="">---</option>
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
          <div className="flex gap-2 items-center justify-between w-full sm:w-auto">
            {field.original && (
              <div tabIndex={-1} className="flex gap-2 flex-1 w-6">
                <img
                  src={iconRaw.src}
                  width={24}
                  className="opacity-30 cursor-pointer inline-block peer"
                />
                <span className="rounded font-display text-sm leading-6 inline-block sm:shadow sm:border sm:absolute sm:invisible sm:hidden sm:-translate-y-full sm:text-right sm:right-8 sm:px-2 sm:pt-1 bg-white sm:peer-hover:visible sm:peer-hover:block">
                  {field.original}
                </span>
              </div>
            )}
            <button
              type="button"
              className="disabled:opacity-30 w-6"
              tabIndex={-1}
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <img src={iconClear.src} width={24} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn-outline mr-2"
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

const validSlug = async (slug: string) => {
  const response = await fetch(`/api/recipes/slug/${slug}`);
  return response.ok;
};

const CreateRecipe: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tags, courses }) => {
  const methods = useForm<RecipeTypes.RecipeInput>({
    defaultValues: INITIAL_STATE
  });

  const onSubmit: SubmitHandler<RecipeTypes.RecipeInput> = async (
    data,
    event
  ) => {
    event.preventDefault();
    const isValidSlug = await validSlug(data.slug);
    if (!isValidSlug) {
      toast.error('Slug in use');
      methods.setError('slug', { type: 'validate', message: 'Slug in use' });
      return;
    }
    const totalTime = mkDuration(data.prepTime)
      .add(mkDuration(data.cookTime))
      .toJSON();

    const imageBlob =
      typeof data.image === 'string' ? null : await toBase64(data.image);
    const recipeInput = {
      ...data,
      ingredients: data.ingredients.map(({ unit, ...rest }) => ({
        ...rest,
        unit: unit === '' ? null : unit
      })),
      totalTime,
      image: imageBlob ? null : data.image,
      imageBlob
    };
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeInput)
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Recipe created correctly!');
        methods.reset(INITIAL_STATE);
      } else {
        toast.error(result.error);
        if (result.target) {
          result.target.forEach((field) =>
            methods.setError(field, { message: result.error })
          );
        }
      }
    } catch (error) {
      toast.error(`There was an error, ${error}`);
    }
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
              <Controller
                name="image"
                render={({ field: { onChange, value } }) => (
                  <ImageInput onChange={onChange} value={value} />
                )}
              />
            </div>
            <div className="relative py-9 px-4 border-t-2 bg-white sm:-mt-14 sm:w-with-padding sm:border-2 sm:mx-auto md:mt-0 md:border-none md:w-3/4 md:p-6">
              <textarea
                placeholder="Name"
                rows={1}
                className={`input font-display font-bold text-h1 p-2 pb-0 w-full mb-4 md:min-h-[4.5rem] ${
                  methods.formState.errors.name ? 'ring-error' : ''
                }`}
                {...methods.register('name', { required: true })}
              ></textarea>
              {methods.formState.errors.name && (
                <p className="text-sm -mt-4 mb-4 font-semibold text-error">
                  {methods.formState.errors.name.message}
                </p>
              )}
              <textarea
                placeholder="Summary"
                rows={3}
                className="input w-full mb-4 md:min-h-[3.5rem]"
                {...methods.register('summary')}
              ></textarea>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="url" className="font-display font-bold block">
                    Recipe url
                  </label>
                  <input
                    placeholder="Recipe url"
                    className="input w-full"
                    id="url"
                    {...methods.register('url')}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="slug"
                    className={`font-display font-bold block ${
                      methods.formState.errors.slug ? 'text-error' : ''
                    }`}
                  >
                    Slug
                  </label>
                  <input
                    id="slug"
                    placeholder="Slug"
                    className={`input w-full ${
                      methods.formState.errors.slug ? 'ring-error' : ''
                    }`}
                    {...methods.register('slug', {
                      required: true
                    })}
                  />
                  {methods.formState.errors.slug && (
                    <p className="text-sm mt-2 font-semibold text-error">
                      {methods.formState.errors.slug.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Details</h2>
            <fieldset name="author">
              <legend className="font-display font-bold">Author</legend>
              <div className="flex flex-col gap-4 md:flex-row mb-4">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Name"
                  {...methods.register('author.name')}
                />
                <input
                  className="input flex-1"
                  placeholder="Website"
                  {...methods.register('author.website')}
                />
              </div>
            </fieldset>
            <div className="flex flex-col gap-4 md:flex-row mb-4">
              <Controller
                name="prepTime"
                render={({ field: { name, onChange, value } }) => (
                  <DurationInput
                    className="flex gap-2 flex-1"
                    label="Prep. time"
                    onChange={onChange}
                    value={value}
                    name={name}
                  />
                )}
              />
              <Controller
                name="cookTime"
                render={({ field: { onChange, value, name } }) => (
                  <DurationInput
                    className="flex gap-2 flex-1"
                    label="Cook time"
                    name={name}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
              <div className="flex-1">
                <label
                  htmlFor="yields"
                  className="font-display font-bold block"
                >
                  Yields
                </label>
                <input
                  id="yields"
                  type="number"
                  className="input w-full"
                  {...methods.register('yields', { required: true })}
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
                  id="servings"
                  className="input w-full"
                  placeholder="2 people"
                  {...methods.register('serves')}
                />
              </div>
            </div>
            <Controller
              name="tags"
              render={({ field: { value, onChange } }) => (
                <TagInput
                  name="tag"
                  options={tags}
                  className="mb-4"
                  tags={value}
                  onChange={onChange}
                  label="Tags"
                  placeholder="mexican"
                />
              )}
            />
            <Controller
              name="courses"
              render={({ field: { value, onChange } }) => (
                <TagInput
                  name="courses"
                  options={courses}
                  tags={value}
                  onChange={onChange}
                  label="Course"
                  placeholder="dessert"
                />
              )}
            />
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Ingredients</h2>
            <IngredientInputs />
          </div>
          <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
            <h2 className="text-grey-500 mb-2">Instructions</h2>
            <InstructionsInputs />
          </div>
          <div className="border-t-2 flex flex-col justify-between gap-4 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6 md:flex-row">
            <button
              type="reset"
              className="btn-outline"
              onClick={(e) => {
                e.preventDefault();
                methods.reset(INITIAL_STATE);
              }}
            >
              Reset
            </button>
            <button type="submit" className="btn-default">
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await prisma.tag.findMany({
    distinct: ['name']
  });
  const courses = await prisma.course.findMany({
    distinct: ['name']
  });
  return {
    props: {
      tags,
      courses
    }
  };
};

export default CreateRecipe;
