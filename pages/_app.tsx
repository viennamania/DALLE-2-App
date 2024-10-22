import '../styles/globals.css'


import {ThirdwebProvider} from 'thirdweb/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();


function MyApp({ Component, pageProps }) {

  // Create a client
  ///const [queryClient] = useState(() => new QueryClient());


  return (

    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <ToastContainer />
        <Component {...pageProps} />
      </ThirdwebProvider>
    </QueryClientProvider>

  )


}

export default MyApp
