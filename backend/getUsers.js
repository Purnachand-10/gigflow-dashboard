const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gigflow').then(async () => {
  const users = await mongoose.connection.collection('users').find({}).toArray();
  console.log('--- USERS LIST ---');
  users.forEach(u => {
    console.log(`Name: ${u.name} | Role: ${u.role} | ID: ${u._id}`);
  });
  process.exit(0);
});
