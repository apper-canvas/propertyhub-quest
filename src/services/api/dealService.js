import { delay } from '../index';
let dealData = [];

// Import mock data
const loadMockData = async () => {
  if (dealData.length === 0) {
    const { default: mockDeals } = await import('../mockData/deals.json');
    dealData = [...mockDeals];
  }
};

const dealService = {
  async getAll() {
    await delay(300);
    await loadMockData();
    return [...dealData];
  },

  async getById(id) {
    await delay(200);
    await loadMockData();
    const deal = dealData.find(item => item.id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    await loadMockData();
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      stage: 'lead'
    };
    dealData.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updateData) {
    await delay(350);
    await loadMockData();
    const index = dealData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    dealData[index] = { ...dealData[index], ...updateData };
    return { ...dealData[index] };
  },

  async delete(id) {
    await delay(250);
    await loadMockData();
    const index = dealData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    const deleted = dealData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default dealService;