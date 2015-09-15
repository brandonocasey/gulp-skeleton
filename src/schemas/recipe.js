var Joi = require("joi");
var yaml = require('js-yaml');
var fs = require('fs');

var measurements = [
  'tbsp',  'Tablespoon',
  'tsp',   'Teaspoon',
  'cnt',   'Count',
  'cp',    'Cup',
  'pt',    'Pint',
  'lbs',   'Pound',
  'litre', 'liter',
  'floz',  'fluidounce',
  'g',     'gram',
  'gal',   'gallon',
  'qt',    'quart',
];
var recipe = module.exports = Joi.object().required().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  source: Joi.string().uri(),
  feeds: Joi.number().min(1).required(),
  images: Joi.array().min(1).unique().required().items(Joi.string().regex(/\.(png|gif|jpg|jpeg)$/).required()),
  ingredients: Joi.array().min(1).required().unique().items(Joi.object().required().keys({
    name: Joi.string().required(),
    count: Joi.string().regex(/^[0-9]+((\/|.)[0-9]+)?$/).required(),
    measurement: Joi.string().regex( RegExp("^(" + measurements.join("|") + ")$", "i") ).required(),
    special: Joi.string(),
  })),
  steps: Joi.array().min(1).required().unique().items(Joi.object().required().keys({
    text: Joi.string().required(),
    time: Joi.number().min(1).required(),
    interval: Joi.string().regex(/^(second|minute|hour|s|m|h)$/i).required(),
    temperature: Joi.object().required().min(1).max(1).keys({
      stove: Joi.string().regex(/^(Low|Low\-Medium|Medium|Medium\-High|High)$/i),
      degree: Joi.object().keys({
        type: Joi.string().regex(/^(Farenheight|Celcius|Kelvin|f|h|k)$/i).required(),
        number: Joi.number().min(1).required()
      })
    })
  }))
});

var data = yaml.safeLoad(fs.readFileSync('../data/recipes/turkey-meatballs.yaml', 'utf8'));
Joi.validate(data, recipe, function(err, value) {
  if(err) throw new Error(err)
})
