const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, './db/contacts.json');

async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath);
        const contacts = JSON.parse(data);
        return contacts;
    } catch (error) {
        console.error(error.message);
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        const selectedContact = contacts.find(({ id }) => id === contactId);

        if (!selectedContact) {
            console.log(`There is no contact with ID: ${contactId}`);
            return;
        }
        console.log('Selected contact:', selectedContact);
    } catch (error) {
        console.error(error.message);
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        const selectedContact = contacts.find(({ id }) => id === contactId);

        if (!selectedContact) {
            console.log(`There is no contact with ID: ${contactId}`);
            return;
        }

        const filteredContacts = contacts.filter(({ id }) => id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
        console.log(`Contact with ID: ${contactId} has been removed successfully!`);
        return;
    } catch (error) {
        console.error(error.message);
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const matchedContactName = contacts.find(contact =>
            contact.name.toLowerCase() === name.toLowerCase());
        const matchedContactEmail = contacts.find(contact =>
            contact.email.toLowerCase() === email.toLowerCase());
        const matchedContactPhone = contacts.find(contact =>
            contact.phone === phone);

        if (matchedContactName) {
            console.log(`Contact ${name} is already in list!`);
            return;
        } else if (matchedContactEmail) {
            console.log(`Contact with email: ${email} is already in list!`);
            return;
        } else if (matchedContactPhone) {
            console.log(`Contact with phone: ${phone} is already in list!`);
            return;
        }

        const newContact = { id: nanoid(), name, email, phone, };
        const newContactList = JSON.stringify([newContact, ...contacts]);
        await fs.writeFile(contactsPath, newContactList);
        console.log(`Contact ${name} has been added successfully!`);
        return;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};
