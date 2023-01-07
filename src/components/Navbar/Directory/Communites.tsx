import { Box, Flex, Icon, MenuItem,MenuList,Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunityModal/CreateCommunityModal';
import {GrAdd}from 'react-icons/gr';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';
import { GrGroup } from 'react-icons/gr';
import MenuListItem from './MenuListItem';

type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {
    const [open, setOpen]=useState(false)
    const mySnippets = useRecoilValue(communityState).mySnippets
    return (
        <>
        <CreateCommunityModal open={open} handleClose={()=>setOpen(false)} /> 
        <Box mt={3} mb={4}>
            <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">MODERATING</Text>
        </Box>

        {
            mySnippets
            .filter((snippet)=>snippet!.isModerator)
            .map(snippet=>(

                <MenuListItem
                 key={snippet.communityId} 
                 icon={GrGroup} 
                 displayText={`r/${snippet.communityId}`}
                 link={`/r/${snippet.communityId}`}
                 iconColor="blue.500"
                 imageURL={snippet.imageURL}
                 />
            ))
        }
        
        <Box mt={3} mb={4}>
            <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">MY GROUPS</Text>
        </Box>
        <MenuItem 
        width="100%"
        fontSize="10pt"
        _hover={{bg:"gray.100"}}
        onClick={()=>setOpen(true)}
        >
        <Flex alignItems="center">
          <Icon fontSize={20} mr={2} as={GrAdd} />
          Create Community
        </Flex>
        </MenuItem>
        {
            mySnippets.map(snippet=>(
                <MenuListItem
                 key={snippet.communityId} 
                 icon={GrGroup} 
                 displayText={`r/${snippet.communityId}`}
                 link={`/r/${snippet.communityId}`}
                 iconColor="green.500"
                 imageURL={snippet.imageURL}
                 />
            ))
        }
        </>

    )
}
export default Communities;