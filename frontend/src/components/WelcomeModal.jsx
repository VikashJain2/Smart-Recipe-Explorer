import React, { useState } from 'react';
import { FiX, FiChevronRight, FiChevronLeft, FiCheck, FiCoffee, FiZap, FiBook, FiUsers } from 'react-icons/fi';

const WelcomeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  
  if (!isOpen) return null;
  
  const steps = [
    {
      icon: <FiCoffee className="text-4xl" />,
      title: "Welcome to Smart Recipe Explorer!",
      content: "Your AI-powered cooking companion that helps you discover, create, and simplify recipes.",
      features: [
        "AI recipe suggestions based on ingredients",
        "Step-by-step instruction simplification",
        "Advanced search and filtering",
        "Beautiful recipe organization"
      ]
    },
    {
      icon: <FiBook className="text-4xl" />,
      title: "Add Your First Recipe",
      content: "Start by adding recipes manually or let AI help you create new ones.",
      tips: [
        "Use the 'Add Recipe' button to create your own",
        "Try AI Assistant for ingredient-based suggestions",
        "Categorize recipes by cuisine and difficulty",
        "Add tags for better organization"
      ]
    },
    {
      icon: <FiZap className="text-4xl" />,
      title: "Powerful AI Features",
      content: "Leverage artificial intelligence to enhance your cooking experience.",
      features: [
        "Get recipe suggestions from available ingredients",
        "Simplify complex instructions for beginners",
        "Generate new recipes from descriptions",
        "Analyze nutritional content of recipes"
      ]
    },
    {
      icon: <FiUsers className="text-4xl" />,
      title: "Ready to Start Cooking?",
      content: "You're all set! Explore the features and start your culinary journey.",
      nextSteps: [
        "Add your favorite family recipes",
        "Try AI suggestions for meal planning",
        "Filter recipes by cuisine and difficulty",
        "Save recipes for quick access"
      ]
    }
  ];
  
  const currentStep = steps[step - 1];
  
  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold">Getting Started Guide</h2>
              <p className="opacity-90">Step {step} of {steps.length}</p>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <FiX className="text-white text-xl" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index + 1 <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-yellow-600 mb-6">
              {currentStep.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
              {currentStep.title}
            </h3>
            
            <p className="text-gray-600 text-center mb-8 max-w-md">
              {currentStep.content}
            </p>
            
            {/* Features/Tips List */}
            <div className="w-full max-w-md space-y-3">
              {currentStep.features?.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
              
              {currentStep.tips?.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
              
              {currentStep.nextSteps?.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg flex items-center ${
                step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <FiChevronLeft className="mr-2" />
              Previous
            </button>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStep(index + 1)}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 === step ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center"
            >
              {step === steps.length ? 'Get Started' : 'Next'}
              <FiChevronRight className="ml-2" />
            </button>
          </div>
          
          {/* Skip Option */}
          {step < steps.length && (
            <div className="text-center mt-6">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip tutorial and explore on my own
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;