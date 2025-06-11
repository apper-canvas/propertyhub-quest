export { default as contactService } from './api/contactService';
export { default as propertyService } from './api/propertyService';
export { default as dealService } from './api/dealService';
export { default as taskService } from './api/taskService';

// Utility function for API delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));