import DashboardPage from '@/components/pages/DashboardPage';
import ContactsPage from '@/components/pages/ContactsPage';
import PropertiesPage from '@/components/pages/PropertiesPage';
import DealsPage from '@/components/pages/DealsPage';
import TasksPage from '@/components/pages/TasksPage';
import HomePage from '@/components/pages/HomePage'; // Recreated as per instructions, though not directly used in routeArray

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
component: ContactsPage
  },
  properties: {
    id: 'properties',
    label: 'Properties',
    path: '/properties',
    icon: 'Home',
component: PropertiesPage
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Handshake',
component: DealsPage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: TasksPage
  }
};

export const routeArray = Object.values(routes);