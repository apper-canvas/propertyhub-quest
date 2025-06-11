import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="Home" className="w-24 h-24 text-primary/30 mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
          Property Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Go to Dashboard
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/contacts" className="text-secondary hover:text-primary transition-colors">
              Contacts
            </Link>
            <Link to="/properties" className="text-secondary hover:text-primary transition-colors">
              Properties
            </Link>
            <Link to="/deals" className="text-secondary hover:text-primary transition-colors">
              Deals
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;