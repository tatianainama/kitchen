/* eslint-disable max-lines-per-function */
import React, { FC, useState, useRef } from 'react';
import { Button } from '@/components/Button';
import Layout from '@/components/Layout';
import { Prisma } from '@prisma/client';

const CreateRecipe: FC = () => {
  const [
    url,
    setUrl
  ] = useState('');

  const [
    scrapedRecipe,
    setScrapedRecipe
  ] = useState<Recipe>(null);

  const [
    postResult,
    setPostResult
  ] = useState(null);

  const [
    file,
    setFile
  ] = useState(null);
  const fileInput: React.RefObject<HTMLInputElement> = useRef(null);

  const submitData = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await fetch(
        '/api/recipes',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...scrapedRecipe,
            image: file })
        }
      ).then((res) => res.json());
      setPostResult(result);
    } catch (error) {
      setPostResult(`Error! ${error}`);
    }
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files.item(0);
      console.log(uploadedFile);
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onload = () => {
        const { result } = reader;
        console.log(JSON.stringify(result));
        setFile(JSON.stringify(result));
      };
    }
  };


  const scrapeData = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await fetch(
        '/api/scrape',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        }
      ).then((response) => response.json());
      setScrapedRecipe({ ...result,
        author: {
          name: 'Laura Vitale',
          website: 'https://laurainthekitchen.com/'
        } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <form onSubmit={scrapeData}>
        <input id="scrape-url" onChange={(ev) => setUrl(ev.target.value)} type="text" value={url} />
        <Button type="submit">Scrape</Button>
      </form>
      <form onSubmit={submitData}>
        <input type="file" id="recipe-image" accept="image/*" onChange={onChangeFile} ref={fileInput} />
        <Button type="submit" disabled={!scrapedRecipe || !file}>Submit</Button>
      </form>
      {
        postResult && <pre>{JSON.stringify(
          postResult,
          null,
          2
        )}</pre>
      }
      {
        scrapedRecipe &&
          <pre>
            {JSON.stringify(
              scrapedRecipe,
              null,
              2
            )}
          </pre>

      }
    </Layout>
  );
};

type Recipe = Prisma.RecipeCreateInput & {
  ingredients: Prisma.IngredientCreateInput[],
  author: Prisma.AuthorCreateInput,
}


export default CreateRecipe;
