const mongoose = require('mongoose');
const User = require('../models/user');
const dbName = 'project-2';
mongoose.connect(`mongodb://localhost/${dbName}`);


const user = [
  {
    name: 'rui',
    password: 'asdf',
    email: 'bhbhhb@vgvgv.com'
  }
]


User.create(user, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${user.length} `)
  mongoose.connection.close();
});