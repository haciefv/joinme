import React, { useState } from 'react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    Divider,
    Text,
    Input,
    Stack,
    Checkbox,
    Flex,
    Icon,
  } from '@chakra-ui/react';
import {BsFillEyeFill,BsFillPersonFill}from "react-icons/bs";
import {HiLockClosed}from "react-icons/hi";
import { auth, firestore } from '../../../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import useDirectory from '../../../hooks/useDirectory';


type CreateCommunityModalProps = {
    open:boolean;
    handleClose:()=>void;
};

const CreateCommunityModal:React.FC<CreateCommunityModalProps> = ({open,handleClose}) => {
    const [user]=useAuthState(auth)
    const [communityName,setCommunityName]=useState("")
    const [charsRemaining,setCharsRemaining]=useState(21)
    const [communityType,setcommunityType]=useState("public")
    const [error,setError]=useState("")
    const [loading,setLoading]=useState(false)
    const router = useRouter()
    const {toggleMenuOpen}=useDirectory()

    const handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        if (event.target.value.length>21) return;

        setCommunityName(event.target.value)
        setCharsRemaining(21-event.target.value.length)
    }

    const onCommunityTypeChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setcommunityType(event.target.name)
    }
    const handleCreateCommunity =async () => {
        setError("")
        // Validate the community 
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(format.test(communityName)||communityName.length<3){
            setError("Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.")
            return;
        }

        setLoading(true)
        try {
            const communityDocRef= doc(firestore,"communities",communityName)
            
            await runTransaction(firestore,async (transaction) => {
                const communityDoc= await transaction.get(communityDocRef)
                if (communityDoc.exists()){
                    throw new Error(`Sorry r/ ${communityName}name is taken. Try another`)
                    return
                }
                // Create community
                await transaction.set(communityDocRef,{
                    creatorId:user?.uid,
                    createdAt:serverTimestamp(),
                    numberOfMembers:1,
                    privacyType:communityType,
        
        
                })
                transaction.set(doc(firestore,`users/${user?.uid}/communitySnippets`,communityName),{
                    communityId:communityName,
                    isModerator:true
                })
                
            })
            handleClose()
            toggleMenuOpen()
            router.push(`r/${communityName}`)
            // Check if community exists in db 
            // Create a community document in firesotre 
        } catch (error:any) {
            console.log("Some error",error)
            setError(error.message)
            
        }
        setLoading(false)



    }


    return (
        <>
    
          <Modal isOpen={open} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader display="flex" 
              flexDirection="column"
              fontSize={15}
              padding={3}
              >Create Community
              </ModalHeader>
              <Box pl={3} pr={2}>
                <Divider/>
                <ModalCloseButton/>
                <ModalBody 
                display="flex"
                flexDirection="column"
                padding="10px 0px"
                >
                    <Text fontWeight={600} fontSize={15}>
                        Name
                    </Text>
                    <Text fontSize={11} color="gray.500">
                        Community names including capitalization cannot be changed 
                    </Text>
                    <Text position="relative" top="28px" left="10px" width="20px" color="gray.400">r/</Text>
                    <Input 
                    position='relative'
                    value={communityName} 
                    size="sm" 
                    pl="22px"
                    onChange={handleChange} />
                    <Text fontSize="9pt"
                    color="red"
                    pt={1}>
                        {error}
                    </Text>
                    <Text fontSize ="9pt"  
                    color={charsRemaining ===0 ?"red":"gray.500"}
                    >
                    {charsRemaining} Character remaining
                    </Text>
                    <Box mt={4} mb={4}>
                        <Text fontWeight={600} fontSize={15} mt={4}>
                            Community Type
                        </Text>
                        <Stack>
                            <Checkbox name="public" 
                            isChecked={communityType==="public"} 
                            onChange={onCommunityTypeChange}>
                                <Flex align="center">
                                    <Icon as={BsFillPersonFill} color="gray.500" mr={2}/>
                                    <Text fontSize="10pt" mr={1}>
                                        Public                                
                                    </Text>
                                    <Text fontSize="8pt" color="gray.500"pt={1} >
                                        Anyone can view, post and comment to this communication
                                    </Text>
                                </Flex>

                            </Checkbox>
                            <Checkbox name="restricted" 
                            isChecked={communityType==="restricted"} 
                            onChange={onCommunityTypeChange}>
                                <Flex align="center">
                                <Icon as={BsFillEyeFill} color="gray.500" mr={2}/>
                                    <Text fontSize="10pt" mr={1}>
                                        Restricted                                
                                    </Text>
                                    <Text fontSize="8pt" color="gray.500"pt={1} >
                                        Anyone can view this community, but only aproved users can post
                                    </Text>
                                </Flex>
                            </Checkbox>
                            <Checkbox name="private" 
                            isChecked={communityType==="private"}
                            onChange={onCommunityTypeChange}>
                                <Flex align="center">
                                <Icon as={HiLockClosed} color="gray.500" mr={2}/>
                                    <Text fontSize="10pt" mr={1}>
                                        Private                                
                                    </Text>
                                    <Text fontSize="8pt" color="gray.500"pt={1} >
                                        Onlye aproved users can view and post in this community
                                    </Text>
                                </Flex>
                            </Checkbox>
                        </Stack>
                    </Box>
                </ModalBody>
              </Box>

    
              <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
                <Button variant="outline" 
                colorScheme='blue' 
                height="30px"
                mr={3} 
                onClick={handleClose}>
                  Cancel
                </Button>
                <Button height="30px" 
                onClick={handleCreateCommunity} 
                isLoading={loading}>Create Community</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}
export default CreateCommunityModal;