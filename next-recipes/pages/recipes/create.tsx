import { FC, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { RecipeTypes } from 'additional';
import iconClear from '@/components/Icons/clear.svg';

import {
  useForm,
  SubmitHandler,
  FormProvider,
  useFormContext,
  useFieldArray,
  Controller,
  useController
} from 'react-hook-form';
import { UnitName } from '@prisma/client';
import { mkDuration } from '@/utils/duration';

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
            className="input flex-1 sm:flex-auto sm:w-1/12"
            defaultValue=""
            {...register(`ingredients.${index}.unit` as const)}
          >
            <option value="" disabled>
              ---
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

const DurationInput: FC<{
  name: string;
  label?: string;
  className?: string;
  onChange: (value: string) => void;
  value: string;
}> = ({ name, label, className, onChange, value }) => {
  const initial = mkDuration(value);
  const [minutes, setMinutes] = useState(initial.minutes());
  const [hours, setHours] = useState(initial.hours());

  useEffect(() => {
    const newValue = mkDuration(value);
    if (newValue.minutes() !== minutes) {
      setMinutes(newValue.minutes());
    }
    if (newValue.hours() !== hours) {
      setHours(newValue.hours());
    }
  }, [value]);

  return (
    <fieldset name={name} className={className}>
      {label && <legend className="font-display font-bold">{label}</legend>}
      <input
        id={`${name}-h`}
        type="number"
        value={hours}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const h = parseInt(e.target.value);
          setHours(h);
          onChange(mkDuration({ hours: h, minutes }).toISOString());
        }}
        min={0}
        max={100}
        className="input flex-1"
        placeholder="h"
      />
      <input
        id={`${name}-m`}
        type="number"
        value={minutes}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const m = parseInt(e.target.value);
          setMinutes(m);
          onChange(mkDuration({ hours, minutes: m }).toISOString());
        }}
        min={0}
        max={60}
        className="input flex-1"
        placeholder="m"
      />
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

const PreviewImage: FC<{ image: string | File | null }> = ({ image }) => {
  const getPreview = (data: string | File) =>
    typeof data === 'string' ? data : URL.createObjectURL(data);
  return image ? (
    <img src={getPreview(image)} className="w-full h-full object-cover" />
  ) : null;
};

const ImageInput: FC = () => {
  const {
    field: { value, onChange }
  } = useController({ name: 'image', defaultValue: '' });

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="relative w-full h-full">
      <PreviewImage image={value} />
      {value ? (
        <button
          className="absolute bottom-2 right-2 p-2 bg-primary bg-opacity-30 rounded-full hover:bg-opacity-80"
          type="button"
          onClick={() => onChange('')}
        >
          <img src={iconClear.src} width={20} height={20} className="" />
        </button>
      ) : (
        <>
          <input
            type="file"
            id="recipe-image"
            name="recipe-image"
            accept="image/*"
            className="w-px h-px opacity-0 overflow-hidden absolute -z-10"
            onChange={update}
          />
          <label
            htmlFor="recipe-image"
            className="absolute bottom-2 right-2 p-2 bg-primary bg-opacity-30 rounded-full hover:bg-opacity-80 cursor-pointer"
          >
            <img
              src={iconClear.src}
              width={20}
              height={20}
              className="rotate-45"
            />
          </label>
        </>
      )}
    </div>
  );
};

const CreateRecipe: FC = () => {
  const methods = useForm<RecipeTypes.RecipeInput>({
    defaultValues: {
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

  const onSubmit: SubmitHandler<RecipeTypes.RecipeInput> = async (
    data,
    event
  ) => {
    event.preventDefault();
    const totalTime = mkDuration(data.prepTime)
      .add(mkDuration(data.cookTime))
      .toJSON();
    const toBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const imageBlob =
      typeof data.image === 'string' ? null : await toBase64(data.image);
    const result = {
      ...data,
      totalTime,
      image: imageBlob ? null : data.image,
      imageBlob
    };
    console.log(result);
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
              <ImageInput />
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
                <input
                  placeholder="Recipe url"
                  className="input flex-1"
                  {...methods.register('url')}
                />
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
                render={({ field: { ref, ...rest } }) => (
                  <DurationInput
                    className="flex gap-2 flex-1"
                    label="Prep. time"
                    {...rest}
                  />
                )}
              />
              <Controller
                name="cookTime"
                render={({ field: { ref, ...rest } }) => (
                  <DurationInput
                    className="flex gap-2 flex-1"
                    label="Cook time"
                    {...rest}
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
