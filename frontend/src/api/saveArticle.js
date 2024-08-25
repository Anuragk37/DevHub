import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const saveArticle = async (articleData, setArticleData) => {
  try {
    const response = await axiosInstance.post(`article/save-article/${articleData.id}/`);
        const message = articleData.is_saved 
      ? 'Article unsaved successfully' 
      : 'Article saved successfully';
    
    setArticleData(prevData => ({
      ...prevData,
      is_saved: !prevData.is_saved
    }));
    
    toast.success(message);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export default saveArticle;
