import mongoose from "mongoose";
import dotenv from "dotenv";
import Contact from "./model/contacts.js";

dotenv.config();

const getContacts = async () => {
  const result = await Contact.find().exec();
  console.log(result);
};

try {
  const dbConnection = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to database...");
} catch (error) {
  console.error("An error has occured.");
}

getContacts();
