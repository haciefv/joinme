import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Community {
    id:string;
    creatorId:string;
    numberOfMembers:number;
    privacyType:"public"|"restrictee"|"private";
    cretedAt?:Timestamp;
    imageURL?:string;
}
export interface CommunitySnippet{
    communityId:string;
    isModerator?:boolean;
    imageURL?:string

}
interface communityState{
    mySnippets: CommunitySnippet[],
    currentCommunity?:Community;
    snippetFetched:boolean;

}
const defaultcommunityState: communityState={
    mySnippets:[],
    snippetFetched:false,
}
export const communityState = atom<communityState>({
    key:"communitiesState",
    default: defaultcommunityState,
})