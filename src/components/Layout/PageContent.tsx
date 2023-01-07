import { Flex } from '@chakra-ui/layout';
import React from 'react';

type PageContentProps = {
    children:any
};

const PageContent:React.FC<PageContentProps> = ({children}) => {
    return (
        <Flex  p="16px 0px" justify="center">
            <Flex
               width="95%"
               justify="center" 
               maxWidth="860px" >
                {/* LHS */}
                <Flex 
                  direction="column" 
                  width={{base:"100%",md:"65%"}}
                  mr={{base:0,md:6}}>
                    {children && children[0]as keyof typeof children}
                </Flex>
                {/* Rhs */}
                <Flex 
                  direction="column"
                  display={{base:"none",md:"flex"}}
                  flexGrow={1}>

                    {children && children[1]as keyof typeof children}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PageContent;