const fs = require('fs/promises');
const path = require('path');
const { uid } = require('uid');

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
            console.log(`There is no contact with such ${contactId}`);
            return;
        }
        return selectedContact;
    } catch (error) {
        console.error(error.message);
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        const filteredContacts = contacts.filter(({ id }) => id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
        return;
    } catch (error) {
        console.error(error.message);
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const newContact = { id: uid(), name, email, phone, };
        const newContactList = JSON.stringify([newContact, ...contacts]);
        await fs.writeFile(contactsPath, newContactList);
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
