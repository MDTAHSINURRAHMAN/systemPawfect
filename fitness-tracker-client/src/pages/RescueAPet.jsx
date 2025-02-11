import { useState } from 'react';
import { motion } from 'framer-motion';

const RescueAPet = () => {
  const [volunteerMessages, setVolunteerMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [volunteerInput, setVolunteerInput] = useState('');
  const [aiInput, setAiInput] = useState('');

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    if (!volunteerInput.trim()) return;
    
    setVolunteerMessages([...volunteerMessages, {
      text: volunteerInput,
      sender: 'user'
    }]);
    setVolunteerInput('');
    
    // Simulate volunteer response
    setTimeout(() => {
      setVolunteerMessages(prev => [...prev, {
        text: "Thank you for reaching out! Our volunteer will respond shortly.",
        sender: 'volunteer'
      }]);
    }, 1000);
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    setAiMessages([...aiMessages, {
      text: aiInput,
      sender: 'user'
    }]);
    setAiInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        text: "I'm here to help! What would you like to know about pet rescue?",
        sender: 'ai'
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0F1413]"
        >
          Get Help With Pet Rescue
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Volunteer Chat */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#0F1413]">Chat with Volunteer</h2>
            <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {volunteerMessages.map((msg, idx) => (
                <div key={idx} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-[#FF640D] text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleVolunteerSubmit} className="flex gap-2">
              <input
                type="text"
                value={volunteerInput}
                onChange={(e) => setVolunteerInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-[#FF640D]"
                placeholder="Type your message..."
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-[#FF640D] text-white rounded-lg hover:bg-[#ff7a33] transition-colors"
              >
                Send
              </button>
            </form>
          </motion.div>

          {/* AI Assistant Chat */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#0F1413]">Chat with AI Assistant</h2>
            <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-[#FF640D] text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAiSubmit} className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-[#FF640D]"
                placeholder="Type your message..."
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-[#FF640D] text-white rounded-lg hover:bg-[#ff7a33] transition-colors"
              >
                Send
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RescueAPet;
