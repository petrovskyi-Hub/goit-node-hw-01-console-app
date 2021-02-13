import fs from "fs/promises";
import path from "path";
import colors from "colors";

const contactsPath = path.resolve("./db/contacts.json");

export function listContacts() {
  fs.readFile(contactsPath)
    .then((data) => {
      console.log("List of contacts:".magenta);
      console.table(JSON.parse(data));
    })
    .catch((err) => console.error(err.message));
}

export function getContactById(contactId) {
  fs.readFile(contactsPath)
    .then((data) => {
      const contacts = JSON.parse(data);
      const contact = contacts.find(({ id }) => id === contactId);

      if (!contact)
        return console.error(`Contact with ID ${contactId} not found!`.red);

      console.log(`Contact with ID ${contactId}:`.magenta);
      console.table(contact);
    })
    .catch((err) => console.error(err.message));
}

export function removeContact(contactId) {
  fs.readFile(contactsPath)
    .then((data) => {
      const contacts = JSON.parse(data);
      const newContacts = contacts.filter(({ id }) => id !== contactId);

      if (contacts.length === newContacts.length) {
        return console.error(`Contact with ID: ${contactId} not found!`.red);
      }

      fs.writeFile(contactsPath, JSON.stringify(newContacts))
        .then(() => {
          console.log(
            "Contact deleted successfully! New list of contacts:".magenta
          );
          console.table(newContacts);
        })
        .catch((err) => console.error(err.message));
    })
    .catch((err) => console.error(err.message));
}

export function addContact(name, email, phone) {
  fs.readFile(contactsPath)
    .then((data) => {
      const contacts = JSON.parse(data);

      if (
        contacts.find(
          (contact) => contact.name.toLowerCase() === name.toLowerCase()
        )
      )
        return console.warn("This name already exists!".yellow);

      if (contacts.find((contact) => contact.email === email))
        return console.warn("This email already exists!".yellow);

      if (contacts.find((contact) => contact.phone === phone))
        return console.warn("This phone already exists!".yellow);

      const maxID = contacts[contacts.length - 1].id;

      const newContact = {
        id: maxID + 1,
        name,
        email,
        phone,
      };
      const newContacts = [...contacts, newContact];

      fs.writeFile(contactsPath, JSON.stringify(newContacts))
        .then(() => {
          console.log(
            "Contact added successfully! New list of contacts:".magenta
          );
          console.table(newContacts);
        })
        .catch((err) => console.error(err.message));
    })
    .catch((err) => console.error(err.message));
}
