import { useState } from 'react'
import { nftContractAddress } from '../config.js'
import { ethers } from 'ethers'
import { useEthers } from '@usedapp/core'
import { SwapWidget } from '@brydge-network/widget'


import NFT from '../../build/contracts/BrydgeCollection.json'
import uriList from '../../metadata/data.json'

const MintPage = () => {
	const [mintedNFT, setMintedNFT] = useState(null)
	const [miningStatus, setMiningStatus] = useState(null)
	const [currentAccount, setCurrentAccount] = useState('')
	const { library } = useEthers()
	const idOfNFTToBuy = 3

	function encodedCalls(nftId){
		const mintableContract = NFT.abi
		const mintableContractInterface = new ethers.utils.Interface(mintableContract);
		const mintPrice = ethers.utils.parseEther("0.001")
		const nftUri = uriList[nftId]
		const mintableContractCalldata = mintableContractInterface.encodeFunctionData('mintBrydgeNFT', [nftUri]);
		const calls = [
			{ _to: nftContractAddress, _value: mintPrice, _calldata: mintableContractCalldata },
		  ];
		return calls
	}


	// Calls Metamask to connect wallet on clicking Connect Wallet button
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' })
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x4'
			const polygonChainId = '0x89'
			const ethereumChainId = '0x1'

			const devChainId = 1337
			const localhostChainId = `0x${Number(devChainId).toString(16)}`

			if (chainId !== rinkebyChainId && chainId !== localhostChainId && chainId !== polygonChainId && chainId !== ethereumChainId) {
				alert('You are not connected to the Rinkeby Testnet or Polygon Mainnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}
	
	return (
		<div className='flex flex-col items-center pt-32 bg-[#0B132B] text-[#d3d3d3] min-h-screen'>
			<div className='trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='60'
					height='60'
					fill='currentColor'
					viewBox='0 0 16 16'
				>
					<path d='M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z' />
				</svg>
			</div>
			<h2 className='text-3xl font-bold mb-20 mt-12'>
				Mint Brydge NFT
			</h2>
			{currentAccount === '' ? (
				<button
					className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={connectWallet}
				>
					Connect Wallet
				</button>
			) : (
				<SwapWidget
                jsonRpcEndpoints={{
                  1: 'https://mainnet.infura.io/v3/d3c71913403e47b4ac4813c7adb96043',
                  137: 'https://polygon-mainnet.infura.io/v3/d3c71913403e47b4ac4813c7adb96043',
                }}
								calls={encodedCalls(idOfNFTToBuy)}
                provider={library}
                defaultOutputTokenAddress='NATIVE'
                defaultOutputAmount={0.001}
                title='Mint Brydge Tutorial NFT'
                destinationChainId={137}
              />
			)}
			{miningStatus === 1 ? (
				<h2 className='text-3xl font-bold mb-20 mt-12'>
					NFT Minted Successfully!
				</h2>
			) : (
				<div></div>
			)}
		</div>
	)
}

export default MintPage