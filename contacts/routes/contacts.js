var express = require("express");
var router = express.Router();
const contactsController = require("../controllers/contactsController");

router.get("/", contactsController.getAllContacts);
router.post("/", contactsController.createContact);
router.put("/:id", contactsController.updateContact);
router.delete("/:id", contactsController.deleteContact);
router.patch("/:id", contactsController.updateStatusContact);

module.exports = router;
