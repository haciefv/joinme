/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
import {
    collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModals";
import { communityState } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
const [ user] = useAuthState(auth)
const router = useRouter();
const setAuthModalState = useSetRecoilState(authModalState);
const[postStateValue,setPostStateValue] = useRecoilState(postState)
const currentCommunity = useRecoilValue(communityState).currentCommunity
const communityStateValue = useRecoilValue(communityState);

    const onVote = async ( 
    event:React.MouseEvent<HTMLDivElement,MouseEvent>,
    post:Post, 
    vote:number,
    communityId:string)=>{
      event.stopPropagation();

        if (!user?.uid) {
            setAuthModalState({ open: true, view: "login" });
            return;
          }
          const{voteStatus}=post;
          const existingVote = postStateValue.postVotes.find(
              (vote) => vote.postId === post.id
            );
    try {
          console.log("PSS")
        //   console.log("Existing Votes \n",existingVote)

          
          const batch = writeBatch(firestore)
          
          const updatedPost = {...post}
          const updatedPosts = [...postStateValue.posts];
          let updatedPostVotes = [...postStateValue.postVotes];
          let voteChange = vote;
        
        if (!existingVote){
            const postVoteRef=doc(
              collection(firestore,"users", `${user?.uid}/postVotes`)
            )
            const newVote :PostVote= {
                id: postVoteRef.id,
                postId:post.id!,
                communityId,
                voteValue:vote,
            }
            
        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
        console.log("Vote sent")

        
        
        }
        else {
            // Used for both possible cases of batch writes
            const postVoteRef = doc(
              firestore,
              "users",
              `${user?.uid}/postVotes/${existingVote.id}`
            );

          console.log("Existing Votes \n",existingVote.voteValue,vote)

          
            // Removing vote
            if (existingVote.voteValue === vote) {
              voteChange *= -1;
              updatedPost.voteStatus = voteStatus - vote;
              updatedPostVotes = updatedPostVotes.filter(
                (vote) => vote.id !== existingVote.id
              );
              batch.delete(postVoteRef);
            }
            // Changing vote

          }

        const postidx = postStateValue.posts.findIndex(
          (item)=>item.id===post.id)
        
        updatedPosts[postidx] = updatedPost

        setPostStateValue(prev=>({
            ...prev,
            posts:updatedPosts,
            postVotes:updatedPostVotes
        }))

        if(postStateValue.selectedPost){
          setPostStateValue((prev)=>({
            ...prev,
            selectedPost:updatedPost
          }))
        }

        const postRef=doc(firestore,"posts",post.id!)
        batch.update (postRef,{voteStatus:voteStatus+voteChange})
        await batch.commit();
    } 
    catch (error) {
        console.log("onVote Error",error)
        
    }
    }
    const onSelectPost = (post:Post)=>{
        setPostStateValue((prev)=>({
            ...prev,
            selectedPost:post,

        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    }

    const onDeletetPost = async (post:Post):Promise<boolean>=>{
        try {
            if(post.imageURL){
                const imageRef = ref(storage,`posts/${post.id}/image`)
                await deleteObject(imageRef)
            }
            const postDocRef=doc(firestore,"posts",post.id!)
            await deleteDoc(postDocRef)

            
            setPostStateValue(prev=>({
                ...prev,
                posts:prev.posts.filter((item)=>item.id !==post.id)
            }))
            return true;
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const getCommunityPostVotes = async (communityId: string) => {
        const postVotesQuery = query(
          collection(firestore, "users",`${user?.uid}/postVotes`),
          where('communityId', "==", communityId)
        );

        const postVoteDocs = await getDocs(postVotesQuery);
        
        const postVotes = postVoteDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          postVotes: postVotes as PostVote[],
        }));
    
        // const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
        //   const postVotes = querySnapshot.docs.map((postVote) => ({
        //     id: postVote.id,
        //     ...postVote.data(),
        //   }));
    
        // });
    
        // return () => unsubscribe();
      };

      useEffect(() => {
        
        if (!user?.uid || !communityStateValue.currentCommunity) return;
        getCommunityPostVotes(communityStateValue.currentCommunity.id);
      }, [user, communityStateValue.currentCommunity]);
    
    // const getCommunityPostVotes =async (communityId:string) => {
    //     const postVotesQuery = (
    //         query 
    //         (collection(firestore,"users",`${user?.uid}/postVotes`),
    //         where('communityId',"==",communityId)))
    //         console.log("RESULTTTT",postVotesQuery)

    //         const postVoteDocs = await getDocs(postVotesQuery)
    //         const postVotes = postVoteDocs.docs.map (doc =>({ 
    //             id: doc.id,
    //             ...doc.data()
    //         }))
    //         setPostStateValue(prev =>({
    //             ...prev,
    //             postVotes:postVotes as PostVote[]
    //         }))
    // }




    useEffect(()=>{
        if(!user ||!currentCommunity?.id)return;
        getCommunityPostVotes(currentCommunity?.id);
    },[user,currentCommunity])
    useEffect(()=>{
        if(!user ){
            setPostStateValue((prev)=>({
                ...prev,
                postVotes:[]
            }))

        };
    },[user])



    // useEffect(() => {
    //     if (!user?.uid || !communityStateValue.currentCommunity) return;
    //     getCommunityPostVotes(communityStateValue.currentCommunity.id);
    //   }, [user, communityStateValue.currentCommunity]);
    

    return {
        postStateValue,
        setPostStateValue,
        onVote ,
        onSelectPost,
        onDeletetPost,
    }
}
export default usePosts;