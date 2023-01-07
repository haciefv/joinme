import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { RiTeamFill } from 'react-icons/ri';
import { useRecoilState, useRecoilValue } from 'recoil';
import { communityState } from '../atoms/communitiesAtom';
import { DirectoryMenuItem, DirectoryMenuState } from '../atoms/DirectoryMenut';


const useDirectory= () => {
    const [directoryState,setDirectoryState] = useRecoilState(DirectoryMenuState)
    const router = useRouter()
    const communityStateValue = useRecoilValue(communityState)

    const onSelectMenuItem = (menuItem: DirectoryMenuItem)=>{
        setDirectoryState(prev =>({
            ...prev,selectedMenuItem: menuItem
        }))
        router.push(menuItem.link)
        if(directoryState.isOpen){
            toggleMenuOpen()
        }
    };


    const toggleMenuOpen =()=>{
        
        setDirectoryState(prev =>({
            ...prev,
            isOpen: !directoryState.isOpen
        }))
    }

    useEffect(()=>{
        const {currentCommunity} = communityStateValue
        if (currentCommunity){
            setDirectoryState(prev=>({
                ...prev,
                selectedMenuItem:{
                    displayText:`${currentCommunity.id}`,
                    link:`/r/${currentCommunity.id}`,
                    imageURL:currentCommunity.imageURL,
                    Icon:RiTeamFill,
                    iconColor:"blue.500"
                },

            }))
    }
    
    },[communityStateValue, communityStateValue.currentCommunity, setDirectoryState])


    return{directoryState, toggleMenuOpen, onSelectMenuItem}
}
export default useDirectory;