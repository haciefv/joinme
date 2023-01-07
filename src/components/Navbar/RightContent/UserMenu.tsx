import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    Icon,
    Flex,
    Text,
  } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import { signOut, User } from 'firebase/auth';
import { BiUser } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin} from "react-icons/md";
import { auth } from '../../../firebase/clientApp';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModals';
import Login from '../../Modal/Auth/Login';
import { IoSparkles } from "react-icons/io5";
import { communityState } from '../../../atoms/communitiesAtom';


type UserMenuProps = {
    user?:User|null;
};

const UserMenu:React.FC<UserMenuProps> = ({user}) => {
    const resetCommunityState = useResetRecoilState(communityState)
    const setAuthModalState=useSetRecoilState(authModalState)
    const logout= async()=>{
        await signOut(auth)
        // resetCommunityState()
    }
    return (
        <Menu>
  <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4}
  _hover={{outline:"1px solid",outlineColor:"gray.200" }}
  >
    {user? (
        <Flex >

          <Flex align="center">
          <>
          <Icon
           as={BiUser} 
           fontSize={24}
           mr={1}
           color="gray.300"
          
           />
           <Flex
           direction="column"
           display={{base:"none",lg:"flex"}}
           fontSize="8pt"
           align="flex-start"
           me={8}

           >
            <Text
            fontWeight={700}
            >
                {user?.displayName||user.email?.split("@")[0]}

            </Text>

           </Flex>

          </>

          <ChevronDownIcon/>
          </Flex>
        </Flex>
    ):
    <Flex align="center">
        <Icon fontSize={24} color="gray.400" mr={1} as={VscAccount} />
        <ChevronDownIcon/>
    </Flex>}
    
  </MenuButton>
  <MenuList>

    {user?(
        <>
            <MenuItem 
    fontSize="10pt" 
    fontWeight="700"
    _hover={{bg:"blue.500",color:"white"}}
    >
    <Flex align="center">
        <Icon as={CgProfile} 
        fontSize={20} 
        mr={2}
        />Profile
    </Flex>
    </MenuItem>
    <MenuDivider/>
    <MenuItem 
    fontSize="10pt" 
    fontWeight="700"
    _hover={{bg:"blue.500",color:"white"}}
    onClick = {logout }
    >
    <Flex align="center">
        <Icon as={MdOutlineLogin} 
        fontSize={20} 
        mr={2}
        />
        Log Out
    </Flex>
    </MenuItem>
        </>
    )
    :
    (<>
        <MenuItem 
    fontSize="10pt" 
    fontWeight="700"
    _hover={{bg:"blue.500",color:"white"}}
    onClick = {()=>{
        setAuthModalState({open:true,view:"login"})
    }}
    >
    <Flex align="center">
        <Icon as={MdOutlineLogin} 
        fontSize={20} 
        mr={2}
        />Log in/Signup
    </Flex>
    </MenuItem>

    </>)}

  </MenuList>
</Menu>
    )
}
export default UserMenu;