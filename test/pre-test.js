const axios = require('axios');

const CREATE_USER = 'http://52.15.91.107:3000/api/v1/user';
const user0 = {
  username: 'user0',
  password: 'user0pw',
};
const user1 = {
  username: 'user1',
  password: 'user1pw',
};
const user2 = {
  username: 'user2',
  password: 'user2pw',
};

async function createUser(user) {
  try {
    const { status, data } = await axios.post(CREATE_USER, user);
    console.log('status:%s, data:%j', status, data);
  } catch (e) {
    console.log(e.message);
    if (e.response) {
      console.log(e.response.data);
    }
  }
}

async function main() {
  await createUser(user0);
  await createUser(user1);
  await createUser(user2);
}

main();
