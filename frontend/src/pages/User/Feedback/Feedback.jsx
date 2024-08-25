import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPaperPlane, FaImage, FaLightbulb, FaStar } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';

const Feedback = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const watchImage = watch('image');

  React.useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [watchImage]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('feedback', data.feedback);
    formData.append('improvement', data.improvement);
    formData.append('rating', rating);
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    try {
      await axiosInstance.post('admin/feedback/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Feedback submitted successfully!');
      reset();
      setRating(0);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-purple-600 px-6 py-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">Your Feedback Matters</h2>
          <p className="mt-2 text-lg text-purple-200">Help us improve your experience</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                Share Your Experience
              </label>
              <textarea
                id="feedback"
                rows="4"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                placeholder="Tell us what you think..."
                {...register('feedback', { required: true })}
              ></textarea>
            </div>

            <div>
              <label htmlFor="improvement" className="block text-sm font-medium text-gray-700 mb-1">
                Suggestions for Improvement
              </label>
              <div className="relative">
                <FaLightbulb className="absolute top-3 left-3 text-purple-500" />
                <textarea
                  id="improvement"
                  rows="3"
                  className="w-full pl-10 pr-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="How can we make things better?"
                  {...register('improvement')}
                ></textarea>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Upload an Image (optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-500 transition duration-150">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto" />
                  ) : (
                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        {...register('image')}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate Your Experience
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors duration-150`}
                    onClick={() => {
                      setRating(star);
                      setValue('rating', star);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`bg-purple-600 text-white px-8 py-3 rounded-md text-lg font-semibold flex items-center hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                <FaPaperPlane className="mr-2" />
                {isSubmitting ? 'Sending...' : 'Submit Feedback'}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;