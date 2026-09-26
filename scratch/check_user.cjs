const mongoose = require("mongoose");
const User = require("../backend/models/User");
const uri = "mongodb+srv://apcfriend123_db_user:Sounava2005@travelguruji.2lvhyea.mongodb.net/?appName=TravelGuruji";

async function check() {
  await mongoose.connect(uri);
  const users = await User.find({
    $or: [{ email: /karmakar/i }, { phone: /7596870561/ }]
  });
  console.log("Found users:", users.map(u => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, lastLoginAt: u.lastLoginAt })));
  await mongoose.disconnect();
}
check().catch(console.error);
