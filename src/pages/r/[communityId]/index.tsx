/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
import { Community, communityState } from "../../../atoms/communitiesAtom";

import { auth, firestore } from "../../../firebase/clientApp";
import NotFound from "../../../components/Community/NotFound";
import Header from "../../../components/Community/Header";
import Layout from "../../../components/Layout/Layout";
import PageContent from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Posts/Posts";
import About from "../../../components/Community/About";

interface CommunityPageProps {
  communityData: Community;
  // userId?:string;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
//   const [user, loadingUser] = useAuthState(auth);
console.log("here is community data",communityData)
const setCommunityStateValue= useSetRecoilState(communityState)
    if (!communityData){
    return<NotFound/>
    }
    useEffect(() => {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: communityData,
      }));
    }, [communityData]);
    return(
        <>
            <Header communityData={communityData}/>
            <PageContent >
                <>
                  <CreatePostLink/>
                  <Posts communityData={communityData} />
                </>
                <>
                  <About communityData={communityData}/>
                </>
            </PageContent>
        </>

    )
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("GET SERVER SIDE PROPS RUNNING");

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : "",
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
    return { props: {} }
  }
}
