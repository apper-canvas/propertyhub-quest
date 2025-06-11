import { delay } from '../index';
let contactData = [];

// Import mock data
const loadMockData = async () => {
  if (contactData.length === 0) {
    const { default: mockContacts } = await import('../mockData/contacts.json');
    contactData = [...mockContacts];
  }
};

const contactService = {
  async getAll() {
    await delay(300);
    await loadMockData();
    return [...contactData];
  },

  async getById(id) {
    await delay(200);
    await loadMockData();
    const contact = contactData.find(item => item.id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    await loadMockData();
    const newContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    };
    contactData.push(newContact);
    return { ...newContact };
  },

  async update(id, updateData) {
    await delay(350);
    await loadMockData();
    const index = contactData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contactData[index] = { ...contactData[index], ...updateData };
    return { ...contactData[index] };
  },

  async delete(id) {
    await delay(250);
    await loadMockData();
    const index = contactData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    const deleted = contactData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default contactService;