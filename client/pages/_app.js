import '../styles/globals.css'
import { DAppProvider, Mainnet } from '@usedapp/core';
import { getDefaultProvider } from 'ethers'

function MyApp({ Component, pageProps }) {

  const config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
      [Mainnet.chainId]: getDefaultProvider('mainnet'),
    },
  };
  return(
    <DAppProvider config={config}>
     <Component {...pageProps} />
     </DAppProvider>
  )
}

export default MyApp