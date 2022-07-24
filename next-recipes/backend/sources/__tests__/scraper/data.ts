import { RecipeTypes } from 'additional';

export const inputs = [
  'https://www.laurainthekitchen.com/recipes/best-oven-fries/',
  'https://www.allrecipes.com/recipe/273535/tuscan-pasta-salad/',
  'https://www.justonecookbook.com/chicken-teriyaki/'
] as const;

type Inputs = typeof inputs[number];

type Outputs = {
  [key in Inputs]: RecipeTypes.ScrapedRecipe;
};

export const outputs: Outputs = {
  'https://www.laurainthekitchen.com/recipes/best-oven-fries/': {
    url: 'https://www.laurainthekitchen.com/recipes/best-oven-fries/',
    author: {
      name: 'Laura in the Kitchen',
      website: 'https://laurainthekitchen.com'
    },
    name: 'Best Oven Fries',
    slug: 'best-oven-fries',
    instructions: [
      'Cut the potatoes into thin �(French fries) shape. Place the potatoes in a bowl full of cold water and allow them to sit for 30 minutes.',
      'Drain the potatoes and dry them thoroughly. Place them on a microwave safe plate (you will need to do this in batches) and microwave the potatoes for about 3 or 4 minutes or until the potatoes have softened a bit.',
      'Meanwhile preheat your oven to 425 degrees and place a nonstick baking sheet in the oven to preheat it as well.',
      'Toss your partially cooked potatoes with your vegetable oil and place them in a single layer on the hot baking sheet.',
      'Roast the potatoes for about 20 minutes (or longer depending on how hot your oven is) flipping them over if you need to to get them nicely colored on both sides and crispy.',
      'When the potatoes come out of the oven, sprinkle over the salt, pepper, parmiggiano, garlic and parsley and toss them while the potatoes are hot.',
      'Serve right away!'
    ],
    ingredients: [
      {
        original: '3 Large Russet Potatoes, peeled',
        group: '',
        quantity: '3',
        unit: 'LARGE',
        name: 'russet potatoes',
        note: 'peeled'
      },
      {
        original: '3 Tbsp of Vegetable Oil',
        group: '',
        quantity: '3',
        unit: 'TBSP',
        name: 'vegetable oil',
        note: undefined
      },
      {
        original: '3 Cloves of Garlic, minced',
        group: '',
        quantity: '3',
        unit: 'CLOVES',
        name: 'garlic',
        note: 'minced'
      },
      {
        original: '2 Tbsp of Finely Chopped Parsley',
        group: '',
        quantity: '2',
        unit: 'TBSP',
        name: 'finely chopped parsley',
        note: undefined
      },
      {
        original: '1/4 cup of Freshly Grated Parmiggiano (parmesan cheese)',
        group: '',
        quantity: '0.25',
        unit: 'CUP',
        name: 'freshly grated parmiggiano',
        note: 'parmesan cheese'
      },
      {
        original: 'Salt and Pepper',
        group: '',
        quantity: null,
        unit: null,
        name: 'salt and pepper',
        note: undefined
      }
    ],
    prepTime: 'PT10M',
    cookTime: 'PT30M',
    yields: 4,
    serves: 'Serves 4',
    tags: [],
    courses: [],
    image: 'http://laurainthekitchen.com/500x300thumbnails/best-oven-fries.jpg'
  },
  'https://www.allrecipes.com/recipe/273535/tuscan-pasta-salad/': {
    url: 'https://www.allrecipes.com/recipe/273535/tuscan-pasta-salad/',
    author: {
      name: 'A Piatt',
      website: undefined
    },
    summary:
      'A flavorful diversion from the run-of-the-mill Italian pasta salad. I like to serve this with grilled, fried, or barbecued chicken, and a crusty artisan bread. I would double the portions if you want to have leftovers when serving 4 or more; this goes fast in my home! Enjoy!',
    prepTime: 'P0DT0H30M',
    cookTime: 'P0DT0H15M',
    totalTime: 'P0DT0H45M',
    image:
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F6662445.jpg',
    yields: 8,
    serves: '8 cups',
    tags: [],
    courses: [
      {
        name: 'tomato pasta salad'
      }
    ],
    name: 'Tuscan Pasta Salad',
    slug: 'tuscan-pasta-salad',
    instructions: [
      'Bring a large pot of lightly salted water to a boil. Cook bow-tie pasta at a boil, stirring occasionally, until tender yet firm to the bite, about 12 minutes. Drain.\n',
      'Combine pasta, tomatoes, Italian dressing, vegan mayonnaise, celery, cucumber, pepperoncini peppers, red onion, banana peppers, olives, mozzarella cheese, and Parmesan cheese in a large mixing bowl. Mix until the dressing takes on a creamy consistency and all ingredients are thoroughly coated.\n',
      'Season salad with salt and pepper. Serve immediately or refrigerate, mixing again just before serving.\n'
    ],
    ingredients: [
      {
        group: '',
        quantity: '1',
        unit: 'CUP',
        name: 'bow-tie pasta',
        note: undefined,
        original: '1 cup bow-tie pasta'
      },
      {
        group: '',
        quantity: '1',
        unit: null,
        name: '½ cups grape tomatoes',
        note: 'sliced',
        original: '1 ½ cups grape tomatoes, sliced'
      },
      {
        group: '',
        quantity: '1',
        unit: 'CUP',
        name: 'italian dressing',
        note: 'such as kraft® tuscan house italian',
        original: '1 cup Italian dressing (such as Kraft® Tuscan House Italian)'
      },
      {
        group: '',
        quantity: '1',
        unit: 'CUP',
        name: 'vegan mayonnaise',
        note: 'such as vegenaise®',
        original: '1 cup vegan mayonnaise (such as Vegenaise®)'
      },
      {
        group: '',
        quantity: '3',
        unit: null,
        name: 'stalks celery',
        note: 'chopped',
        original: '3 stalks celery, chopped'
      },
      {
        group: '',
        quantity: '1',
        unit: null,
        name: 'cucumber',
        note: 'peeled and chopped',
        original: '1 cucumber, peeled and chopped'
      },
      {
        group: '',
        quantity: '0.5',
        unit: 'CUP',
        name: 'pepperoncini peppers',
        note: 'minced',
        original: '½ cup pepperoncini peppers, minced'
      },
      {
        group: '',
        quantity: '0.5',
        unit: 'CUP',
        name: 'red onion',
        note: 'diced',
        original: '½ cup red onion, diced'
      },
      {
        group: '',
        quantity: '0.5',
        unit: 'CUP',
        name: 'sweet banana peppers',
        note: 'diced',
        original: '½ cup sweet banana peppers, diced'
      },
      {
        group: '',
        quantity: '0.5',
        unit: 'CUP',
        name: 'kalamata olives',
        note: 'pitted and chopped',
        original: '½ cup Kalamata olives, pitted and chopped'
      },
      {
        group: '',
        quantity: '0.5',
        unit: 'CUP',
        note: undefined,
        name: 'shredded mozzarella cheese',
        original: '½ cup shredded mozzarella cheese'
      },
      {
        group: '',
        quantity: '0.5',
        unit: 'CUP',
        note: undefined,
        name: 'shredded parmesan cheese',
        original: '½ cup shredded Parmesan cheese'
      },
      {
        group: '',
        quantity: null,
        unit: null,
        note: undefined,
        name: 'salt and ground black pepper to taste',
        original: 'salt and ground black pepper to taste'
      }
    ]
  },
  'https://www.justonecookbook.com/chicken-teriyaki/': {
    url: 'https://www.justonecookbook.com/chicken-teriyaki/',
    author: {
      name: 'Namiko Chen',
      website: ''
    },
    summary:
      'Glazed in a flavorful homemade sauce, this classic Chicken Teriyaki is so juicy and tender when prepared in the authentic Japanese method. No bottled teriyaki sauce needed!',
    prepTime: 'PT10M',
    cookTime: 'PT15M',
    totalTime: 'PT55M',
    image:
      'https://www.justonecookbook.com/wp-content/uploads/2019/10/Chicken-Teriyaki-9942-III.jpg',
    yields: 2,
    serves: '2',
    tags: [
      {
        name: 'teriyaki'
      },
      {
        name: 'teriyaki sauce'
      },
      {
        name: 'japanese'
      }
    ],
    courses: [
      {
        name: 'main course'
      }
    ],
    name: 'Chicken Teriyaki',
    slug: 'chicken-teriyaki',
    instructions: [
      'Gather all the ingredients.',
      'In a large bowl, combine the grated ginger and grated onion, including their juices. I use this grater to grate the ginger.',
      'Prick both sides of the chicken with a fork so it absorbs more flavor. If the thighs are very thick on one side, flatten them to an even thickness with a meat mallet/tenderizer.',
      'Heat a large frying pan over medium heat. When the pan is hot, add the measured oil for step 1. Remove as much of the marinade as possible from the chicken so it gets a nice sear and doesn&#39;t end up steaming in the sauce. Place the chicken skin side down, RESERVING the teriyaki marinade. Use a splatter screen if you have one (it’s a pretty neat tool to prevent oil splatters especially when you cook bacon and oily foods).',
      'You can keep the leftovers in an airtight container and store in the refrigerator for 3 days or in the freezer for a month.'
    ],
    ingredients: [
      {
        name: 'ginger',
        quantity: '1',
        unit: null,
        note: '(1 inch, 2.5 cm)',
        group: '',
        original: '▢ 1 knob ginger (1 inch, 2.5 cm)'
      },
      {
        name: 'onion',
        quantity: '1',
        unit: null,
        note: '(1 oz, 30 g)',
        group: '',
        original: '▢ ¼ onion (1 oz, 30 g)'
      },
      {
        name: 'boneless, skin-on chicken thighs',
        quantity: '1',
        unit: 'LB',
        note: '',
        group: '',
        original: '▢ 1 lb boneless, skin-on chicken thighs'
      },
      {
        name: 'kosher salt (Diamond Crystal; use half for table salt)',
        quantity: '',
        unit: null,
        note: '',
        group: '',
        original: '▢ kosher salt (Diamond Crystal; use half for table salt)'
      },
      {
        name: 'freshly ground black pepper',
        quantity: '',
        unit: null,
        note: '',
        group: '',
        original: '▢ freshly ground black pepper'
      },
      {
        name: 'neutral-flavored oil (vegetable, rice bran, canola, etc.)',
        quantity: '1',
        unit: 'TBSP',
        note: '(for step 1 of cooking the chicken)',
        group: '',
        original:
          '▢ 1 Tbsp neutral-flavored oil (vegetable, rice bran, canola, etc.) (for step 1 of cooking the chicken)'
      },
      {
        name: 'sake',
        quantity: '2',
        unit: 'TBSP',
        note: '(for steaming)',
        group: '',
        original: '▢ 2 Tbsp sake (for steaming)'
      },
      {
        name: 'neutral-flavored oil (vegetable, rice bran, canola, etc.)',
        quantity: '1',
        unit: 'TSP',
        note: '(for step 4 of cooking the chicken)',
        group: '',
        original:
          '▢ 1 tsp neutral-flavored oil (vegetable, rice bran, canola, etc.) (for step 4 of cooking the chicken)'
      },
      {
        name: 'sake',
        quantity: '1',
        unit: 'TBSP',
        note: '',
        group: 'For the Teriyaki Sauce',
        original: '▢ 1 Tbsp sake'
      },
      {
        name: 'mirin',
        quantity: '1',
        unit: 'TBSP',
        note: '',
        group: 'For the Teriyaki Sauce',
        original: '▢ 1 Tbsp mirin'
      },
      {
        name: 'sugar',
        quantity: '1',
        unit: 'TBSP',
        note: '',
        group: 'For the Teriyaki Sauce',
        original: '▢ 1 Tbsp sugar'
      },
      {
        name: 'soy sauce',
        quantity: '2',
        unit: 'TBSP',
        note: '',
        group: 'For the Teriyaki Sauce',
        original: '▢ 2 Tbsp soy sauce'
      },
      {
        name: 'water',
        quantity: '2',
        unit: 'TBSP',
        note: '',
        group: 'For the Teriyaki Sauce',
        original: '▢ 2 Tbsp water'
      }
    ]
  }
};

export default outputs;
