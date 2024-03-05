const Contact = require("../models/contacts.js");

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().exec();
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);

    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  const newContact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  });

  try {
    const createdContact = await newContact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  const filter = { _id: req.params.id };
  const update = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const updatedContact = await Contact.findOneAndUpdate(filter, update);
    res.status(201).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id).exec();
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Contact not found" });
  }
};

exports.updateStatusContact = async (req, res) => {
  const contactId = req.params.id;
  const newFavoriteStatus = req.body.favorite;

  console.log(
    "Updating contact:",
    contactId,
    "with favorite status:",
    newFavoriteStatus
  );

  const filter = { _id: contactId };
  const updateStatus = { favorite: newFavoriteStatus };

  try {
    const updatedStatusContact = await Contact.findOneAndUpdate(
      filter,
      updateStatus,
      { new: true }
    );

    if (updatedStatusContact) {
      console.log("Contact updated successfully:", updatedStatusContact);
      res.status(200).json(updatedStatusContact);
    } else {
      console.log("Contact not found.");
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
