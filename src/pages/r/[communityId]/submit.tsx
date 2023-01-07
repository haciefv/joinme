/* eslint-disable react-hooks/rules-of-hooks */
import { Box,Text } from '@chakra-ui/layout';
import { auth } from '../../../firebase/clientApp';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageContent from '../../../components/Layout/PageContent';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';
import useCommunityData from '../../../hooks/useCommunityData';
import About from '../../../components/Community/About';

type submitProps = {
    
};

const submit:React.FC<submitProps> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const[user] = useAuthState(auth);
  // const communityStateValue = useRecoilValue(communityState)
  const {communityStateValue}= useCommunityData()

  console.log("Community",communityStateValue)
    return (
        <PageContent>
            <>
              <Box p ="14px 0px" borderBottom="1px Solid" borderColor="white">
                <Text>
                    Create a post
                </Text>
              </Box>
            {/* {NewPost} */}
            {user&& <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL}/>}
            
            </>
            <>
            {communityStateValue.currentCommunity &&
              (<About communityData={communityStateValue.currentCommunity} />)}
            </>
        </PageContent>
    )
}
export default submit;