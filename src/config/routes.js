import Dashboard from '../pages/Dashboard';
import Contacts from '../pages/Contacts';
import Properties from '../pages/Properties';
import Deals from '../pages/Deals';
import Tasks from '../pages/Tasks';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  properties: {
    id: 'properties',
    label: 'Properties',
    path: '/properties',
    icon: 'Home',
    component: Properties
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Handshake',
    component: Deals
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  }
};

export const routeArray = Object.values(routes);