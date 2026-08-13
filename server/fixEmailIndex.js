// Run this file once to fix the existing database:
//   node server/fixEmailIndex.js
//
// What it does:
//   1. Drops the old unique index on users.email (sparse or non-sparse)
//   2. Converts existing documents with email: '' to email: null (or removes field)
//   3. Creates a PARTIAL unique index on users.email that only indexes real string emails.
//      Documents with email: null or missing email are NOT indexed, so multiple
//      students without an email are allowed.

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

(async () => {
  try {
    await connectDB();

    const db = mongoose.connection.db;
    const users = db.collection('users');

    // 1. Drop any existing unique email index (email_1)
    const indexes = await users.indexes();
    const emailIndex = indexes.find((idx) => idx.name === 'email_1');
    if (emailIndex) {
      await users.dropIndex('email_1');
      console.log('Dropped old unique index: email_1');
    } else {
      console.log('No email_1 index found - skipping drop');
    }

    // 1b. Also drop any index on email with a different name (safety)
    const otherEmailIndexes = indexes.filter((idx) => idx.key && idx.key.email === 1 && idx.name !== 'email_1');
    for (const idx of otherEmailIndexes) {
      await users.dropIndex(idx.name);
      console.log(`Dropped other email index: ${idx.name}`);
    }

    // 2. Convert existing empty-string emails to null
    const result = await users.updateMany(
      { email: '' },
      { $set: { email: null } }
    );
    console.log(`Converted ${result.modifiedCount} document(s) with email: "" to email: null`);

    // 3. Create PARTIAL unique index on email.
    //    Only documents with a real string email are indexed.
    //    Documents with null/missing email are NOT indexed => duplicates allowed.
    await users.createIndex(
      { email: 1 },
      { unique: true, partialFilterExpression: { email: { $type: 'string' } }, name: 'email_1' }
    );
    console.log('Created PARTIAL unique index: email_1 (only real string emails are unique)');

    console.log('Email index fix completed successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Error fixing email index:', err.message);
    process.exit(1);
  }
})();