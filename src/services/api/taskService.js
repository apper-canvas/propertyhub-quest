import { delay } from '../index';
let taskData = [];

// Import mock data
const loadMockData = async () => {
  if (taskData.length === 0) {
    const { default: mockTasks } = await import('../mockData/tasks.json');
    taskData = [...mockTasks];
  }
};

const taskService = {
  async getAll() {
    await delay(300);
    await loadMockData();
    return [...taskData];
  },

  async getById(id) {
    await delay(200);
    await loadMockData();
    const task = taskData.find(item => item.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    await loadMockData();
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    taskData.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(350);
    await loadMockData();
    const index = taskData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    taskData[index] = { ...taskData[index], ...updateData };
    return { ...taskData[index] };
  },

  async delete(id) {
    await delay(250);
    await loadMockData();
    const index = taskData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    const deleted = taskData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default taskService;