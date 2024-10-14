import '../styles/globals.css'

import type { AppProps } from 'next/app';


import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

/*
import {

  QueryClient,
  QueryClientProvider,

} from "@tanstack/react-query";

import { useState } from 'react';
*/




const queryClient = new QueryClient();




/*
function MyApp({ Component, pageProps }) {

  // Create a client
  ///const [queryClient] = useState(() => new QueryClient());


  return (

    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>

  )


}

export default MyApp
*/




type AppPropsWithLayout = AppProps & {
  Component: {
    getLayout: (page: React.ReactNode) => React.ReactNode;
  };
};

// const firaCode = Fira_Code({
//   weight: ['400', '500', '700'],
//   style: ['normal'],
//   subsets: ['latin'],
//   variable: '--font-body',
// });

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  
  const getLayout = Component.getLayout || ((page) => page);
  
  
  return (
    
    <QueryClientProvider client={queryClient}>
      {getLayout(<Component {...pageProps} />)}
    </QueryClientProvider>

  );

}

export default CustomApp;