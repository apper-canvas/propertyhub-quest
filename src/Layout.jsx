import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentRoute = routeArray.find(route => route.path === location.pathname);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center z-40">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="Menu" size={24} />
        </button>
        <h1 className="ml-4 text-xl font-heading font-semibold text-primary">PropertyHub</h1>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface-50 border-r border-gray-200 flex-col z-40">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-heading font-bold text-primary">PropertyHub</h1>
            <p className="text-sm text-secondary mt-1">Real Estate CRM</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {routeArray.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      }`
                    }
                  >
                    <ApperIcon 
                      name={route.icon} 
                      size={20} 
                      className="mr-3 flex-shrink-0"
                    />
                    {route.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-50"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Drawer */}
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-surface-50 border-r border-gray-200 flex flex-col z-50"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-primary">PropertyHub</h1>
                    <p className="text-sm text-secondary mt-1">Real Estate CRM</p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul className="space-y-2">
                    {routeArray.map((route) => (
                      <li key={route.id}>
                        <NavLink
                          to={route.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                            }`
                          }
                        >
                          <ApperIcon 
                            name={route.icon} 
                            size={20} 
                            className="mr-3 flex-shrink-0"
                          />
                          {route.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Page Header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-semibold text-gray-900">
                  {currentRoute?.label || 'Page'}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-sm">
                  <ApperIcon name="Plus" size={16} className="inline mr-2" />
                  Quick Add
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;