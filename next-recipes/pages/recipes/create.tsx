import React, { FC, useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { RecipeTypes } from 'additional';

const CreateRecipe: FC = () => {
  const [url, setUrl] = useState('');

  const [scrapedRecipe, setScrapedRecipe] =
    useState<RecipeTypes.ScrapedRecipe>(null);

  const [postResult, setPostResult] = useState(null);

  const [file, setFile] = useState(null);
  const fileInput: React.RefObject<HTMLInputElement> = useRef(null);

  const submitData = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scrapedRecipe, image: file })
      }).then((res) => res.json());
      setPostResult(result);
    } catch (error) {
      setPostResult(`Error! ${error}`);
    }
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files.item(0);
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onload = () => {
        const { result } = reader;
        setFile(JSON.stringify(result));
      };
    }
  };

  const scrapeData = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      }).then((response) => response.json());
      setScrapedRecipe({
        ...result,
        author: {
          name: 'Laura Vitale',
          website: 'https://laurainthekitchen.com/'
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="bg-grey-50">
        <form
          onSubmit={scrapeData}
          className="layout-container p-4 md:w-with-padding md:px-0 flex gap-2 items-center"
        >
          <input
            className="text-xs tracking-wide ring-2 ring-grey-100 bg-grey-100 p-2 w-1/3 focus:outline-none focus:ring-black"
            id="scrape-url"
            onChange={(ev) => setUrl(ev.target.value)}
            type="text"
            value={url}
          />
          <button type="submit" className="btn-outline bg-white">
            Scrape
          </button>
        </form>
      </div>
      <form
        className="layout-container md:w-with-padding md:py-4"
        onSubmit={submitData}
      >
        <div className="relative flex flex-col md:flex-row md:border-2 bg-white">
          <div
            id="image-input"
            className="h-48 w-full bg-cover bg-center sm:h-72 sm:border-b-2 md:border-r-2 md:border-b-0 md:h-auto md:min-h-[15rem] md:w-1/4"
          >
            <input
              type="file"
              id="recipe-image"
              accept="image/*"
              className="w-full"
              onChange={onChangeFile}
              ref={fileInput}
            />
          </div>
          <div className="relative py-9 px-4 border-t-2 bg-white sm:-mt-14 sm:w-with-padding sm:border-2 sm:mx-auto md:mt-0 md:border-none md:w-3/4 md:p-6">
            <textarea
              id="recipe-name"
              placeholder="Name"
              rows={1}
              className="input font-display font-bold text-h1 p-2 pb-0 w-full mb-4 md:min-h-[4.5rem]"
            ></textarea>
            <textarea
              id="recipe-summary"
              placeholder="Summary"
              rows={3}
              className="input w-full mb-4 md:min-h-[3.5rem]"
            ></textarea>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                id="recipe-url"
                name="recipe-url"
                placeholder="Recipe url"
                className="input flex-1"
                type="string"
              />
              <input
                id="recipe-slug"
                name="recipe-slug"
                placeholder="Slug"
                className="input flex-1"
                type="string"
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
                name="yields"
                id="yields"
                className="input w-full"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="servings" className="block">
                Servings
              </label>
              <input
                type="text"
                name="servings"
                id="servings"
                className="input w-full"
                placeholder="2 people"
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
          <fieldset className="flex flex-col md:flex-row gap-2">
            <input name="ingredient-qty" type="number" className="input" />
            <input name="ingredient-unit" type="number" className="input" />
            <input name="ingredient-ingredient" type="text" className="input" />
            <input name="ingredient-note" type="text" className="input" />
          </fieldset>
        </div>
        <div className="border-t-2 sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6">
          <h2 className="text-grey-500 mb-2">Instructions</h2>
          <textarea rows={1} className="input w-full" />
        </div>
        <div className="border-t-2 flex flex-col sm:border-2 sm:border-t-0 bg-white py-9 px-4 sm:mx-auto sm:w-with-padding md:w-full md:p-6 md:flex-row ">
          <button type="submit" className="btn-outline">
            Reset
          </button>
          <button type="reset" className="btn-default">
            Save
          </button>
        </div>
      </form>
      {postResult && <pre>{JSON.stringify(postResult, null, 2)}</pre>}
      {scrapedRecipe && <pre>{JSON.stringify(scrapedRecipe, null, 2)}</pre>}
    </Layout>
  );
};

export default CreateRecipe;
