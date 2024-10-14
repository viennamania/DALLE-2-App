import '../styles/globals.css'


import {ThirdwebProvider} from 'thirdweb/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();


function MyApp({ Component, pageProps }) {

  // Create a client
  ///const [queryClient] = useState(() => new QueryClient());


  return (

    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </QueryClientProvider>

  )


}

export default MyApp
