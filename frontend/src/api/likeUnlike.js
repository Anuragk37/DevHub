import axiosInstance from "../utils/axiosInstance";
const likeUnlike = async (id, setArticleData) => {   
   try {
     const response = await axiosInstance.post(`article/like-article/${id}/`);
     setArticleData(prevData => ({
       ...prevData,
       liked: response.data.liked,
       like_count: response.data.like_count
     }));
   } catch (error) {
     console.log(error);
   }
 };

 export default likeUnlike