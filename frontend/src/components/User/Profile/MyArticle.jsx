import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import BaseUrl from '../../../utils/BaseUrls'
import Articles from '../Articles'
import axiosInstance from '../../../utils/axiosInstance'
import toast from 'react-hot-toast'

const MyArticle = ({fromSaved=false,isOwnProfile, userId}) => {
   const [articles, setArticles] = useState([])


   const getArticles = async () =>{
      try{

         if(fromSaved) {
            const response = await axiosInstance.get(`/article/saved-articles/`)
            setArticles(response.data)
         }else{
            const response = await axios.get(`${BaseUrl}/article/user-article/${userId}/`)
            setArticles(response.data)
         }
         
      }catch(error){
         console.log(error)
      }
   }

   useEffect(() => {
      getArticles()
   },[])

   const deleteArticle = async (article_id) =>{
      try{
         console.log(typeof(article_id));
         const resposnse = await axiosInstance.delete(`/article/${article_id}`)
         toast.success("artilce deleted succussfully")
         getArticles()
       }catch(error){
         console.log(error);
       }
   }

   const editArticle = async (artilce_id) =>{
      console.log();
   }

  return (
    <div className="px-8">
      {articles.map((article) => (
        <Articles key={article.id} article={article} from_profile={true} deleteArticle={deleteArticle} editArticle={editArticle} isOwnProfile={isOwnProfile}/>
      ))}
    </div>
  )
}

export default MyArticle
