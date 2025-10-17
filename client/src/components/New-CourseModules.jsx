import React, { useState } from 'react';
import { useAuth } from '../store/auth';
import { useTheme } from '../context/ThemeContext';
import { 
  FaCheckCircle, 
  FaCircle, 
  FaChevronDown, 
  FaChevronUp, 
  FaBook, 
  FaPlayCircle,
  FaClock
} from 'react-icons/fa';

const CourseModules = ({ courseId, modules, progress, onModuleComplete }) => {
  const { API, userdata } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const token = localStorage.getItem('token');
  const [expandedModule, setExpandedModule] = useState(null);
  const [loadingModule, setLoadingModule] = useState(null);
  
  // Toggle module expansion
  const toggleModule = (moduleId) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
    }
  };
  
  // Mark module as complete
  const markModuleComplete = async (moduleId, moduleName, isComplete) => {
    if (!courseId || !userdata?._id) return;
    
    setLoadingModule(moduleId);
    
    try {
      const response = await fetch(`${API}/progress/${courseId}/module`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleId,
          moduleName,
          completed: !isComplete // Toggle completion status
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Call the callback to update parent components
        if (onModuleComplete) {
          onModuleComplete(data.progress);
        }
      }
    } catch (error) {
      console.error('Error updating module progress:', error);
    } finally {
      setLoadingModule(null);
    }
  };
  
  // Check if a module is completed
  const isModuleCompleted = (moduleId) => {
    if (!progress || !progress.modules) return false;
    
    const module = progress.modules.find(m => m.moduleId === moduleId);
    return module ? module.completed : false;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!displayModules.length || !progress?.modules) return 0;
    const completedCount = displayModules.filter(module => 
      progress.modules.find(m => m.moduleId === module.id && m.completed)
    ).length;
    return Math.round((completedCount / displayModules.length) * 100);
  };
  
  // Sample modules if none provided
  const defaultModules = [
    {
      id: 'module1',
      name: 'Introduction to the Course',
      topics: ['Course Overview', 'Setting Up Your Environment', 'Basic Concepts'],
      duration: '30 min',
      lessons: 3
    },
    {
      id: 'module2',
      name: 'Core Fundamentals',
      topics: ['Key Principles', 'Common Patterns', 'Best Practices'],
      duration: '45 min',
      lessons: 4
    },
    {
      id: 'module3',
      name: 'Advanced Techniques',
      topics: ['Performance Optimization', 'Error Handling', 'Real-world Applications'],
      duration: '60 min',
      lessons: 5
    },
    {
      id: 'module4',
      name: 'Project Implementation',
      topics: ['Planning Your Project', 'Building the Core Features', 'Testing and Deployment'],
      duration: '90 min',
      lessons: 6
    }
  ];
  
  const displayModules = modules || defaultModules;
  const progressPercentage = calculateProgress();

  return (
    <div className={`rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
        : 'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
    } p-6`}>
      
      {/* Header with Progress */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            Course Modules
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {displayModules.length} modules • {progressPercentage}% completed
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full sm:w-48">
          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className={`text-xs mt-1 text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {progressPercentage}% Complete
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {displayModules.map((module, index) => {
          const completed = isModuleCompleted(module.id);
          const isExpanded = expandedModule === module.id;
          const isLoading = loadingModule === module.id;
          
          return (
            <div 
              key={module.id}
              className={`border-2 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${
                isDark 
                  ? completed 
                    ? 'border-green-500 bg-gray-800' 
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  : completed 
                    ? 'border-green-400 bg-white' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
              } ${isExpanded ? 'ring-2 ring-opacity-50' : ''} ${
                isDark 
                  ? completed ? 'ring-green-500' : 'ring-blue-500' 
                  : completed ? 'ring-green-400' : 'ring-blue-400'
              }`}
            >
              <div 
                className={`flex justify-between items-center p-4 cursor-pointer transition-colors duration-200 ${
                  isDark 
                    ? completed 
                      ? 'bg-green-900 bg-opacity-20' 
                      : 'hover:bg-gray-700'
                    : completed 
                      ? 'bg-green-50' 
                      : 'hover:bg-blue-50'
                }`}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Module Number */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isDark 
                      ? completed ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                      : completed ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Completion Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markModuleComplete(module.id, module.name, completed);
                    }}
                    disabled={isLoading}
                    className={`text-xl transition-all duration-200 ${
                      completed 
                        ? 'text-green-500 transform scale-110' 
                        : isDark 
                          ? 'text-gray-500 hover:text-green-400' 
                          : 'text-gray-400 hover:text-green-500'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : completed ? (
                      <FaCheckCircle />
                    ) : (
                      <FaCircle />
                    )}
                  </button>
                  
                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`font-semibold text-lg truncate ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {module.name}
                      </span>
                      
                      {/* Module Metadata */}
                      <div className="flex items-center space-x-4 text-sm">
                        {module.duration && (
                          <span className={`flex items-center space-x-1 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <FaClock className="text-xs" />
                            <span>{module.duration}</span>
                          </span>
                        )}
                        {module.lessons && (
                          <span className={`flex items-center space-x-1 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <FaBook className="text-xs" />
                            <span>{module.lessons} lessons</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="w-32 h-1.5 mt-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          completed ? 'w-full bg-green-500' : 'w-1/3 bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Expand/Collapse Icon */}
                <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                  isExpanded ? 'transform rotate-180' : ''
                } ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className={`p-4 border-t transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-700 bg-gray-750' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center mb-3">
                    <FaPlayCircle className={`mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Topics Covered
                    </span>
                  </div>
                  
                  <div className="grid gap-2 pl-6">
                    {module.topics.map((topic, index) => (
                      <div 
                        key={index}
                        className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
                          isDark 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-white'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-blue-400' : 'bg-blue-600'
                        }`} />
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-600 border-opacity-50">
                    <button 
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        isDark 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      Start Learning
                    </button>
                    <button 
                      className={`py-2 px-4 rounded-lg font-medium border transition-all duration-200 ${
                        isDark 
                          ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      Resources
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className={`mt-6 pt-4 border-t text-center ${
        isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
      }`}>
        <p className="text-sm">
          Complete all modules to finish the course
        </p>
      </div>
    </div>
  );
};

export default CourseModules;