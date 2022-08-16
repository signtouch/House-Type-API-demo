import axios from 'axios';

const SIGNTOUCH_USERNAME = 'your_username';
const SIGNTOUCH_PASSWORD = 'your_password';
const TARGET_DEVELOPMENT = 43117;  // this is Beachwood Gardens, change it if you need to
const API_URL = 'https://api.signtouch.co.uk/api/';

const authentication = await axios({
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  url: `${API_URL}/auth/login/`,
  data: {
    username: SIGNTOUCH_USERNAME,
    password: SIGNTOUCH_PASSWORD
  }
})
  .then(r => r.data?.data)
  .catch(err => console.log(err));

const token = `Bearer ${authentication}`;

const developments = await axios({
  method: 'get',
  headers: {
    authorization: token,
    'Content-Type': 'application/json'
  },
  url: `${API_URL}/developments/`,
})
  .then(r => r.data?.data)
  .catch(err => console.log(err));

// find your signtouch-site
const signtouchSite = developments.find(development => development.id === TARGET_DEVELOPMENT);
// find your signtouch-region
const signtouchRegion = developments.find(development => development.id === signtouchSite.parentId);
// find your signtouch-parent
const signtouchParent = developments.find(development => development.id === signtouchRegion.parentId);

// now we can get all the house types for the site
const siteHouseTypes = await axios({
  method: 'get',
  headers: {
    authorization: token,
    'Content-Type': 'application/json'
  },
  url: `${API_URL}/developments/${signtouchSite.id}/houseTypes`
})
  .then(r => r.data?.data)
  .catch(err => console.log(err));

const regionHouseTypes = await axios({
  method: 'get',
  headers: {
    authorization: token,
    'Content-Type': 'application/json'
  },
  url: `${API_URL}/developments/${signtouchRegion.id}/houseTypes`
})
  .then(r => r.data?.data)
  .catch(err => console.log(err));

const parentHouseTypes = await axios({
  method: 'get',
  headers: {
    authorization: token,
    'Content-Type': 'application/json'
  },
  url: `${API_URL}/developments/${signtouchParent.id}/houseTypes`
})
  .then(r => r.data?.data)
  .catch(err => console.log(err));

const allHouseTypes = [
  ...siteHouseTypes,
  ...regionHouseTypes,
  ...parentHouseTypes
];

// logging just the names for readability
console.log('all house types: ', allHouseTypes.map(houseType => houseType.name)); 
