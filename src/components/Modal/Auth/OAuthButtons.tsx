import { Flex,Text } from '@chakra-ui/layout';
import { Button,Image } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithFacebook, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { FacebookAuthProvider,signInWithPopup,  } from "firebase/auth";

const OAuthButtons:React.FC = () => {
    const signInWithFacebook=() =>{
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth,provider).then((re)=>{
            console.log(re)

        }).catch((err)=>{
            console.log(err.message)
        })


    }

    // const [signInWithFacebook,] = useSignInWithFacebook(auth);
    const [signInWithGoogle,user ,loading,error] = useSignInWithGoogle(auth)
    return (
        <Flex
        direction="column"
        width="100%"
        mb={4}>
            <Button variant="oauth" mb={2} isLoading={loading}
             onClick={()=>signInWithGoogle()}>
            <Image src='/images/googlelogo.png' height="20px" mr={4}/>
            Continue with Google
            </Button>

            <Button variant="oauth" mb={2} isLoading={loading}
             onClick={()=>signInWithFacebook()}>
            <Image src='/images/fblogo.png' height="20px" mr={4}/>
            Continue with Facebook
            </Button>
            {error&& <Text>{error.message}</Text>}
        </Flex>
    )
}
export default OAuthButtons;