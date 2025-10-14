import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';

const ListEvents = () => {
  const currency=import.meta.env.VITE_CURRENCY

  const [shows,setShows]=useState([]);
  const [loading,setLoading]=useState(true);

  const getAllShows= async()=>{
    try{
      setShows([{
        movie:dummyShowsData[0],
        showDateTime:"2025-06-30T02:30:00:000Z",
        showPrice:59,
        occupiedSeats:{
          A1:"user-1",
          B1:"user_2",
          c1:"user_3"
        }
      }]);
      setLoading(false)
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllShows();
  },[]);


  return !loading ? (
    <>
       <Title text1="List" text2="Events"/>  
    </>
  ) :<Loading/>
}

export default ListEvents