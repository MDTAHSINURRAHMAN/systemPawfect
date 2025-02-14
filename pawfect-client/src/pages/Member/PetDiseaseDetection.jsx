import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const PetDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
  
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
  
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/dog_skin_disease_detection/1",
        params: {
          api_key: "pEJmKJyfxn7HmfJIuWMn"
        },
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      setResult(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error detecting disease:', error);
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Pet Disease Detection
      </motion.h2>
      
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full max-w-xs"
          />
          
          {preview && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-64 h-64 relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!selectedImage || isLoading}
            className="btn bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? 'Analyzing...' : 'Detect Disease'}
          </motion.button>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Detection Results</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Inference ID:</span>
                <span className="text-gray-600">{result.inference_id}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Processing Time:</span>
                <span className="text-gray-600">{result.time.toFixed(4)}s</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Image Dimensions:</span>
                <span className="text-gray-600">{result.image.width} x {result.image.height}</span>
              </div>
              
              {result.predictions.map((pred, idx) => (
                <div key={idx} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <h4 className="font-semibold text-orange-800 mb-3">Prediction {idx + 1}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-white rounded">
                      <span className="font-medium">Confidence:</span>
                      <span>{(pred.confidence * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded">
                      <span className="font-medium">Class:</span>
                      <span>{pred.class}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded">
                      <span className="font-medium">Position:</span>
                      <span>x: {pred.x}, y: {pred.y}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded">
                      <span className="font-medium">Size:</span>
                      <span>{pred.width} x {pred.height}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PetDiseaseDetection;