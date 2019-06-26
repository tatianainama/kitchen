import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IngredientForm from './index';
import { assocPath } from 'ramda';

const tabs = [
  'for the chicken',
  'for the sauce',
  'for the rice',
  'for the extra steps',
]

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [
        {
          "name": "",
          "ingredients": []
        },
        {
          "name": "For the Chicken:",
          "ingredients": [
            {
              "name": "thin boneless skinless chicken breast",
              "quantity": 1.5,
              "unit": "pound",
              "_original": "1-1/2 lb of Thin Boneless Skinless Chicken Breast",
              "suggestions": []
            },
            {
              "name": "olive oil",
              "quantity": 2,
              "unit": "tablespoon",
              "_original": "2 Tbsp of Olive Oil",
              "suggestions": []
            },
            {
              "name": "juice of  lime",
              "quantity": 1,
              "unit": "",
              "_original": "Juice of 1 Lime",
              "suggestions": []
            },
            {
              "name": "chili powder",
              "quantity": 0.5,
              "unit": "teaspoon",
              "_original": "1/2 tsp of Chili Powder",
              "suggestions": [
                {
                  "_id": "5cf1397d72cd194524435041",
                  "name": "cocoa powder",
                  "variants": [
                    "cocoa"
                  ],
                  "equivalences": {
                    "cup": 1,
                    "gr": 118,
                    "tbsp": 16,
                    "tsp": 48
                  },
                  "referenceUnit": "cup",
                  "prefferedUnit": "gr"
                },
                {
                  "_id": "5cf1397d72cd19452443503c",
                  "name": "icing sugar",
                  "variants": [
                    "confectioner sugar",
                    "powdered sugar"
                  ],
                  "equivalences": {
                    "cup": 1,
                    "gr": 125,
                    "oz": 0.27,
                    "tbsp": 15,
                    "tsp": 45,
                    "lb": 0.27
                  },
                  "referenceUnit": "cup",
                  "prefferedUnit": "gr"
                }
              ]
            },
            {
              "name": "oregano",
              "quantity": 0.5,
              "unit": "teaspoon",
              "_original": "1/2 tsp of Oregano",
              "suggestions": []
            },
            {
              "name": "cumin",
              "quantity": 0.5,
              "unit": "teaspoon",
              "_original": "1/2 tsp of Cumin",
              "suggestions": []
            },
            {
              "name": "paprika",
              "quantity": 0.5,
              "unit": "teaspoon",
              "_original": "1/2 tsp of Paprika",
              "suggestions": []
            },
            {
              "name": "granulated garlic",
              "quantity": 0.5,
              "unit": "teaspoon",
              "_original": "1/2 tsp of Granulated Garlic",
              "suggestions": [
                {
                  "_id": "5cf1397d72cd19452443503b",
                  "name": "granulated sugar",
                  "variants": [
                    "sugar",
                    "plain sugar"
                  ],
                  "equivalences": {
                    "cup": 1,
                    "gr": 200,
                    "oz": 7.1,
                    "tbsp": 14,
                    "tsp": 42,
                    "lb": 0.4
                  },
                  "referenceUnit": "cup",
                  "prefferedUnit": "gr"
                }
              ]
            },
            {
              "name": "salt, to taste",
              "quantity": 0,
              "unit": "",
              "_original": "Salt, to taste",
              "suggestions": []
            }
          ]
        },
        {
          "name": "For the Dressing:",
          "ingredients": [
            {
              "name": "plain greek yogurt",
              "quantity": 0.5,
              "unit": "cup",
              "_original": "1/2 cup of Plain Greek Yogurt",
              "suggestions": [
                {
                  "_id": "5cf1397d72cd194524435040",
                  "name": "yogurt",
                  "variants": [
                    "plain yogurt"
                  ],
                  "equivalences": {
                    "cup": 1,
                    "gr": 245,
                    "oz": 8.64,
                    "tbsp": 16,
                    "tsp": 48
                  },
                  "referenceUnit": "cup",
                  "prefferedUnit": "gr"
                },
                {
                  "_id": "5cf1397d72cd19452443503b",
                  "name": "granulated sugar",
                  "variants": [
                    "sugar",
                    "plain sugar"
                  ],
                  "equivalences": {
                    "cup": 1,
                    "gr": 200,
                    "oz": 7.1,
                    "tbsp": 14,
                    "tsp": 42,
                    "lb": 0.4
                  },
                  "referenceUnit": "cup",
                  "prefferedUnit": "gr"
                },
                {
                  "_id": "5cf1397d72cd194524435030",
                  "name": "all purpose flour",
                  "variants": [
                    "plain flour",
                    "all purpose flour",
                    "regular flour",
                    "flour"
                  ],
                  "equivalences": {
                    "cup": 1,
                    "gr": 125,
                    "tbsp": 15.5,
                    "tsp": 47
                  },
                  "referenceUnit": "cup",
                  "prefferedUnit": "gr",
                  "translation": {
                    "dutch": "patentbloem"
                  }
                }
              ]
            },
            {
              "name": "fresh cilantro",
              "quantity": 1,
              "unit": "cup",
              "_original": "1 cup of Fresh Cilantro",
              "suggestions": []
            },
            {
              "name": "scallions, roughly chopped",
              "quantity": 2,
              "unit": "",
              "_original": "2 Scallions, roughly chopped",
              "suggestions": []
            },
            {
              "name": "juice of  lime or more, according to taste",
              "quantity": 1,
              "unit": "",
              "_original": "Juice of 1 Lime or more, according to taste",
              "suggestions": []
            },
            {
              "name": "olive oil",
              "quantity": 1,
              "unit": "tablespoon",
              "_original": "1 Tbsp of Olive Oil",
              "suggestions": []
            },
            {
              "name": "salt, to taste",
              "quantity": 0,
              "unit": "",
              "_original": "Salt, to taste",
              "suggestions": []
            }
          ]
        },
        {
          "name": "For the rest of the salad:",
          "ingredients": [
            {
              "name": "fresh lettuce of your choice",
              "quantity": 0,
              "unit": "",
              "_original": "Fresh Lettuce of your choice",
              "suggestions": []
            },
            {
              "name": "bell peppers, halved and seeded",
              "quantity": 2,
              "unit": "",
              "_original": "2 Bell Peppers, halved and seeded",
              "suggestions": []
            },
            {
              "name": "scallions or red onion, sliced",
              "quantity": 0,
              "unit": "",
              "_original": "Scallions or REd Onion, sliced",
              "suggestions": []
            },
            {
              "name": "pico de gallo salsa",
              "quantity": 0.5,
              "unit": "cup",
              "_original": "1/2 cup of Pico De Gallo Salsa",
              "suggestions": []
            },
            {
              "name": "avocado, sliced",
              "quantity": 1,
              "unit": "",
              "_original": "1 Avocado, sliced",
              "suggestions": []
            }
          ]
        }
      ]
    }
  }

  updateField = (key) => {
    return (e) => {
      const newValue = e.currentTarget.value;
      this.setState(assocPath(key, newValue, this.state.components))
    }
  }

  render(){
    return (
      <IngredientForm
        components={this.state.components}
        updateField={this.updateField}
      />
    )
  }
}

storiesOf('IngredientForm', module)
  .add('Basic ingredients form', () => <Form/>)