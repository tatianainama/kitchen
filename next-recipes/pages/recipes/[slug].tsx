import { GetStaticPaths, GetStaticProps } from 'next';
import prisma from '@/lib/prisma';
import Layout from '@/components/Layout';
import { FC, useEffect, useRef } from 'react';
import { RecipeTypes } from 'additional';
import IngredientList from '@/components/IngredientList';
import InstructionList from '@/components/InstructionList';
import durationInMinutes from '@/utils/duration';

type RecipeProps = RecipeTypes.Recipe;

export const Recipe: FC<RecipeProps> = (recipe) => {
  const tabsRef = useRef(null);

  useEffect(() => {
    if (tabsRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              document
                .getElementById(target.dataset.tabId)
                .classList.replace('bg-white', 'bg-primary');
            } else {
              document
                .getElementById(target.dataset.tabId)
                .classList.replace('bg-primary', 'bg-white');
            }
          });
        },
        {
          rootMargin: '100% 100% 100% 100%',
          threshold: 0.5
        }
      );

      document
        .querySelectorAll(`section#instructions, section#ingredients`)
        .forEach((element) => {
          observer.observe(element);
        });
      return () => {
        observer.disconnect();
      };
    }
  }, [tabsRef]);

  return (
    <Layout className="md:py-8">
      <div className="layout-container md:w-with-padding">
        <header className="relative flex flex-col md:flex-row md:border-2">
          <div
            style={{ backgroundImage: `url(/uploads/${recipe.image})` }}
            className="h-48 w-full bg-cover bg-center sm:h-96 sm:border-b-2 md:border-r-2 md:border-b-0 md:h-auto md:min-h-[18rem] md:w-4/12"
          ></div>
          <div className="relative py-9 px-4 border-t-2 bg-white sm:-mt-14 sm:w-with-padding sm:border-2 sm:mx-auto md:mt-0 md:border-none md:w-8/12 md:p-6">
            <h1>{recipe.name}</h1>
            {recipe.tags.length ? (
              <ul className="flex absolute top-0 right-2 -translate-y-1/2 space-x-2 sm:relative sm:my-4 sm:translate-y-0 sm:inset-0">
                {recipe.tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="border border-black text-overline bg-primary py-1.5 px-2 shadow-strong-small"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="text-sm flex flex-col-reverse sm:flex-row justify-between my-4">
              {recipe.author && (
                <a href={recipe.author.website}>
                  By{' '}
                  <strong className="font-display">{recipe.author.name}</strong>
                </a>
              )}
              <ul className="flex space-x-2">
                <li>
                  <strong>prep.</strong> {recipe.prepTime}
                </li>
                <li>
                  <strong>cooking</strong> {recipe.cookTime}
                </li>
                <li>
                  <strong>{recipe.yields}</strong>
                </li>
              </ul>
            </div>
            <p className="hidden sm:block">{recipe.summary}</p>
          </div>
        </header>
        <div className="relative bg-white border-t-2 sm:w-with-padding sm:mx-auto sm:border-2 sm:border-t-0 md:w-full ">
          <nav
            ref={tabsRef}
            id="recipe-mobile-navigation"
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden md:invisible"
          >
            <a
              id="ingredients-tab"
              href="#ingredients"
              className="btn-outline bg-white py-2 hover:shadow-none"
            >
              ingredients
            </a>
            <a
              id="instructions-tab"
              href="#instructions"
              className="btn-outline bg-white py-2 -ml-0.5 hover:shadow-none"
            >
              instructions
            </a>
          </nav>
          <div className="flex overflow-x-auto overflow-y-hidden max-h-tabs snap-mandatory snap-x md:max-h-min">
            <section
              className="py-9 px-4 w-full shrink-0 md:p-6 md:w-4/12 overflow-x-hidden overflow-y-scroll snap-center md:overflow-auto"
              id="ingredients"
              data-tab-id="ingredients-tab"
            >
              <h2 className="hidden invisible md:block md:visible mb-4">
                Ingredients
              </h2>
              <IngredientList recipe={recipe} />
            </section>
            <section
              className="py-9 px-4 w-full shrink-0 md:p-6 md:w-8/12 overflow-x-hidden overflow-y-scroll snap-center md:overflow-auto"
              id="instructions"
              data-tab-id="instructions-tab"
            >
              <h2 className="hidden invisible md:block md:visible mb-4">
                Instructions
              </h2>
              <InstructionList instructions={recipe.instructions} />
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug?.toString();
    const recipe = await prisma.recipe.findUnique({
      where: {
        slug
      },
      include: {
        tags: true,
        courses: true,
        ingredients: true,
        author: true
      }
    });

    if (!recipe) {
      throw new Error(`Couldn't find recipe with slug: ${slug}`);
    }
    return {
      props: {
        ...recipe,
        prepTime: `${durationInMinutes(recipe.prepTime)}'`,
        cookTime: `${durationInMinutes(recipe.cookTime)}'`
      }
    };
  } catch (err) {
    return {
      props: {
        errors:
          err instanceof Error
            ? err.message
            : `There was an error while fetching recipe ${params?.slug}`
      }
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: { params: { slug: string } }[] = await prisma.recipe
    .findMany({
      select: {
        slug: true
      }
    })
    .then((recipes) => recipes.map(({ slug }) => ({ params: { slug } })));
  return {
    paths: slugs,
    fallback: 'blocking'
  };
};

export default Recipe;
