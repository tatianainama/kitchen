const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const options = {
  uri: 'https://joyofbaking.com/AppleTart.html',
  transform: body => cheerio.load(body),
};

requestPromise(options).then(($) => {
  //console.log('$', $('.Heading').text());
})
  .catch((err) => {
    console.log(err);
  })
;