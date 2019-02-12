import nano from 'nano';

const couchdb = nano(process.env.COUCHDB_URL || 'http://localhost:5984/');

export default couchdb;