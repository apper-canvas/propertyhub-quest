import { delay } from '../index';
let propertyData = [];

// Import mock data
const loadMockData = async () => {
  if (propertyData.length === 0) {
    const { default: mockProperties } = await import('../mockData/properties.json');
    propertyData = [...mockProperties];
  }
};

const propertyService = {
  async getAll() {
    await delay(300);
    await loadMockData();
    return [...propertyData];
  },

  async getById(id) {
    await delay(200);
    await loadMockData();
    const property = propertyData.find(item => item.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async create(propertyData) {
    await delay(400);
    await loadMockData();
    const newProperty = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    propertyData.push(newProperty);
    return { ...newProperty };
  },

  async update(id, updateData) {
    await delay(350);
    await loadMockData();
    const index = propertyData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    propertyData[index] = { ...propertyData[index], ...updateData };
    return { ...propertyData[index] };
  },

  async delete(id) {
    await delay(250);
    await loadMockData();
    const index = propertyData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deleted = propertyData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default propertyService;