/* eslint-disable react/jsx-key */

import { Stack } from '@chakra-ui/layout';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../atoms/communitiesAtom';
import { Post } from '../../atoms/postsAtom';
import { firestore,auth } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
    communityData:Community
    // userId?: string
};

const Posts:React.FC<PostsProps> = ({communityData}) => {
    const [user]=useAuthState(auth)
    const [loading,setLoading] = useState(false)
    const {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletetPost,
        onSelectPost
    } = usePosts();
    const getPosts = async ()=>{
        try {
            setLoading(true)
            const postsQuery = query(collection(firestore,'posts'),where ("communityId","==",communityData.id),orderBy("createdAt","desc"));
            const postDocs = await getDocs(postsQuery)
            const posts = postDocs.docs.map(doc =>({id:doc.id,...doc.data()}))
            setPostStateValue(prev =>({
                ...prev,
                posts : posts as Post[],
            })

            )
            
            console.log("Posts",posts)
            
            setLoading(false)
            
        } catch (error:any) {
            console.log("getPost error",error.message)
            
        }
    };
        useEffect(()=>{
            getPosts();
        },[communityData])
        console.log(postStateValue)
        postStateValue.postVotes.map((vote) => console.log("Ressss",vote.postId))
        postStateValue.posts.map((item )=>console.log("Item ID",item.id))
    return (
        <>
        {loading?<PostLoader/>:(
           <Stack>
           {postStateValue.posts.map((item )=>(
               <PostItem 
               key={item.id}
               post={item} 
               userIsCreator={user?.uid===item.creatorId} 
               userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === item.id)
                  ?.voteValue
              }
               onVote={onVote}
               onSelectPost={onSelectPost}
               onDeletePost={onDeletetPost}
               
               />
             ))}
           </Stack>
           

        )}

        </>

    )
}
export default Posts;