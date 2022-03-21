/* eslint-disable max-lines-per-function */
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
      <form onSubmit={scrapeData}>
        <input
          id="scrape-url"
          onChange={(ev) => setUrl(ev.target.value)}
          type="text"
          value={url}
        />
        <button type="submit">Scrape</button>
      </form>
      <form onSubmit={submitData}>
        <input
          type="file"
          id="recipe-image"
          accept="image/*"
          onChange={onChangeFile}
          ref={fileInput}
        />
        <button type="submit" disabled={!scrapedRecipe || !file}>
          Submit
        </button>
      </form>
      {postResult && <pre>{JSON.stringify(postResult, null, 2)}</pre>}
      {scrapedRecipe && <pre>{JSON.stringify(scrapedRecipe, null, 2)}</pre>}
    </Layout>
  );
};

export default CreateRecipe;
