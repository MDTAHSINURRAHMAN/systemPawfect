import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const FAQ = () => {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch FAQs
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/faqs');
      return data;
    }
  });

  // Add FAQ
  const addFaqMutation = useMutation({
    mutationFn: async (newFaq) => {
      const { data } = await axios.post('http://localhost:5000/faqs', newFaq);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs']);
      setNewQuestion('');
      setNewAnswer('');
    }
  });

  // Update FAQ
  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, updatedFaq }) => {
      const { data } = await axios.patch(`http://localhost:5000/faqs/${id}`, updatedFaq);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs']);
      setEditingId(null);
    }
  });

  // Delete FAQ
  const deleteFaqMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:5000/faqs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addFaqMutation.mutate({ question: newQuestion, answer: newAnswer });
  };

  const handleUpdate = (id, question, answer) => {
    updateFaqMutation.mutate({
      id,
      updatedFaq: { question, answer }
    });
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage FAQs</h1>

      {/* Add FAQ Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaPlus className="text-orange-500" />
          Add New FAQ
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter question"
            className="input input-bordered w-full"
            required
          />
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Enter answer"
            className="textarea textarea-bordered w-full h-24"
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={addFaqMutation.isLoading}
          >
            {addFaqMutation.isLoading ? 'Adding...' : 'Add FAQ'}
          </button>
        </div>
      </form>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs?.map((faq) => (
          <motion.div
            key={faq._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            {editingId === faq._id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  defaultValue={faq.question}
                  className="input input-bordered w-full"
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <textarea
                  defaultValue={faq.answer}
                  className="textarea textarea-bordered w-full h-24"
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(faq._id, newQuestion, newAnswer)}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 mb-4">{faq.answer}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(faq._id)}
                    className="btn btn-sm btn-ghost"
                  >
                    <FaEdit className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => deleteFaqMutation.mutate(faq._id)}
                    className="btn btn-sm btn-ghost"
                    disabled={deleteFaqMutation.isLoading}
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
