
import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    Flex,
    Text,
    Icon,
    Image
  } from '@chakra-ui/react'

import { ChevronDownIcon } from '@chakra-ui/icons';
import { TiHome } from 'react-icons/ti';
import Communities from './Communites';
import useDirectory from '../../../hooks/useDirectory';



const UserMenu:React.FC = () => {
    const {directoryState, toggleMenuOpen} = useDirectory()
    
    return (
<Menu isOpen={directoryState.isOpen}>
  <MenuButton cursor="pointer" 
  padding="0px 6px"
   borderRadius={4}
   mr={2}
   ml={{base:0,md:2}}
  _hover={{outline:"1px solid",outlineColor:"gray.200" }}
  onClick={toggleMenuOpen}

  >
        <Flex align="center" 
        justify="space-between"
        width={{base:"auto",lg:"200px"}} >

          <Flex align="center">
            {directoryState.selectedMenuItem.imageURL ?(
              <Image 
              src={directoryState.selectedMenuItem.imageURL} 
              borderRadius="full"
              boxSize="24px"
              mr={2}
              alt="a"
               />
            ):(
              <Icon 
              fontSize={24}
              mr={{base:1, md:2}}
              as={directoryState.selectedMenuItem.Icon}
              color="green.400"  />
              
            )}
          <Text display={{base:"none", lg:"flex"}}>
            {directoryState.selectedMenuItem.displayText}
          </Text>

          </Flex>
          <ChevronDownIcon/>
        </Flex>
    
  </MenuButton>
  <MenuList>
            <Communities/>
  </MenuList>

</Menu>
    )
}
export default UserMenu;