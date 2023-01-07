import * as React from 'react';
import Navbar from '../Navbar/Navbar';


type Props = {
  children?: React.ReactNode
};
const Layout: React.FC<Props> = ({children})  => {
  // useAuth(); // will implement later at end of tutorial
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export default Layout;