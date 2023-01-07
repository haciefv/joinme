import { Icon } from "@chakra-ui/react";
import { IconType, } from "react-icons";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

export type DirectoryMenuItem = {
    displayText:string;
    link:string;
    Icon:IconType;
    iconColor:string
    imageURL?:string
}

interface DirectoryMenuState{
    isOpen:boolean;
    selectedMenuItem:DirectoryMenuItem;
}
export const defaultMenuItem:DirectoryMenuItem={
    displayText:"Home",
    link:"/",
    Icon:TiHome,
    iconColor:"black"
}

export const defaultMenuState :DirectoryMenuState={
    isOpen:false,
    selectedMenuItem:defaultMenuItem
}
export const DirectoryMenuState = atom<DirectoryMenuState>({
    key:"DirectoryMenuState",
    default: defaultMenuState
})