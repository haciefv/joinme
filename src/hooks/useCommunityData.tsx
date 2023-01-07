/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { auth, firestore } from "../firebase/clientApp";
import { doc, getDoc, increment, writeBatch } from "firebase/firestore";
import { authModalState } from '../atoms/authModals';
import { useRouter } from 'next/router';


const useCommunityData = () => {
    const [user]= useAuthState(auth)    
    const [communityStateValue,setCommumityStateValue] = 
      useRecoilState(communityState)
    const router = useRouter()  
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");


    const onJoinOrLeaveCommunity = (communityData:Community, isJoined?:boolean)=>{

        if (!user?.uid) {
            setAuthModalState({ open: true, view: "login" });
            return;
          }
        // setLoading(true)
        if (isJoined){
            leaveCommunity(communityData.id)
            return;
        }
        joinCommunity(communityData)
    }

    const getMySnippets = async ()=>{
        setLoading(true)
        try {
            // get users snippets
            const snippetDocs =await getDocs(
                collection(firestore,`users/${user?.uid}/communitySnippets`)
                )
                // console.log("Snip Docs",snippetDocs)

            const snippets = snippetDocs.docs.map((doc)=>({...doc.data()}))
            setCommumityStateValue(prev =>({
                ...prev,
                mySnippets:snippets as CommunitySnippet[],
                snippetFetched:true,
            }))

           
            console.log("Here are my snippets:",snippets)
        } 
        catch (error:any) {
            console.log("getMySnippets error",error)
            setError(error.message)

            
        }
        setLoading(false)
    }
    const joinCommunity= async (communityData:Community)=>{
        setLoading(true)
        // batchwrite
           // creating a new community snippet  
           // updating the of members on community{+1}
        try {
          const batch = writeBatch(firestore)    
          const newSnippet : CommunitySnippet={
            communityId:communityData.id,
            imageURL:communityData.imageURL||"",
            isModerator:user?.uid===communityData.creatorId
          }
          batch.set(
            doc(
                firestore,
                `users/${user?.uid}/communitySnippets`,
                communityData.id),
                newSnippet)

         batch.update(doc(firestore,'communities',communityData.id),{
            numberOfMembers:increment(1)
        })
        await batch.commit()    
        
        setCommumityStateValue(prev=>({
            ...prev,
            mySnippets:[...prev.mySnippets,newSnippet]
        }))
        } 
        catch (error:any) {
            console.log("joinCommunity error:",error)
            setError(error.message)
            
        }
        setLoading(false)
        
    };
    
    const leaveCommunity= async (communityId:string)=>{
        setLoading(true)
        
        // batchwrite
           // deleting a new community snippet from use
           // updating the of members on community {-1}

        try {
            const batch = writeBatch(firestore)   
            
            batch.delete(doc(firestore,`users/${user?.uid}/communitySnippets`,communityId))

            batch.update(doc(firestore,'communities',communityId),{
                numberOfMembers:increment(-1)
            })
            
            await batch.commit()    

            setCommumityStateValue(prev=>({
                ...prev,
                mySnippets:prev.mySnippets.filter(item =>item.communityId !==communityId)
            }))



        }         
        catch (error:any) {
            console.log("leaveCommunity error:",error)
            setError(error.message)
            
        }
        setLoading(false)

    };
const getCommunityData = async (communityId:string)=>{
    try {
        const communityDocRef =doc(firestore,'communities',communityId);
        const communityDoc= await getDoc(communityDocRef)
        
        setCommumityStateValue(prev =>({
            ...prev,
            currentCommunity:{id:communityDoc.id ,...communityDoc.data() }as Community
        }))
    } catch (error) {
        console.log("getCommunityData error",error)
        
    }

}

    useEffect(()=>{
        if(!user) {
            setCommumityStateValue(prev=>({
                ...prev,
                mySnippets:[],
                snippetFetched:false,
            }))
            return;
        };
        getMySnippets()
    },[user])

    
    useEffect(()=>{
        const {communityId}= router.query

        if (communityId && !communityStateValue.currentCommunity){
            getCommunityData(communityId as string)
        }
    },[router.query,communityStateValue.currentCommunity])

    return{
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    }
    }
export default useCommunityData;

