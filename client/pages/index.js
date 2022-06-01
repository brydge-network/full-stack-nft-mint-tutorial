import Head from 'next/head'

import { useState } from 'react'
import { nftContractAddress } from '../config.js'
import { ethers } from 'ethers'
import axios from 'axios'

import NFT from '../../build/contracts/BrydgeCollection.json'
import uriList from '../../metadata/data.json'

const mint = () => {
	const [mintedNFT, setMintedNFT] = useState(null)
	const [miningStatus, setMiningStatus] = useState(null)
	const [currentAccount, setCurrentAccount] = useState('')

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

			const devChainId = 1337
			const localhostChainId = `0x${Number(devChainId).toString(16)}`

			if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	// Creates transaction to mint NFT on clicking Mint Character button
	const mintCharacter = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)
				// let nftTx = await nftContract.createEternalNFT()
				let nftId = await nftContract.tokenCounter()
				nftId = await nftId.toNumber()
				console.log('about to mint Brydge NFT #', nftId)
				const nftUri = uriList[nftId]
				// const nftUri = uriList[0]
				console.log(nftUri)
				let nftTx = await nftContract.mintBrydgeNFT(nftUri, { value: ethers.utils.parseEther("0.001") })
				console.log('Mining....', nftTx.hash)
				setMiningStatus(0)

				let tx = await nftTx.wait()
				console.log('Mined!', tx)

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)

				getMintedNFT(nftId)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
		}
	}

	// Gets the minted NFT data
	const getMintedNFT = async (nftId) => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)
				// let nftId = await nftContract.tokenCounter()
				// nftId = await nftId.toNumber()
			
				// console.log(nftId)
				let tokenUri = await nftContract.tokenURI(nftId)
				let data = await axios.get(tokenUri)
				let image = data.data

				setMiningStatus(1)
				// setMintedNFT(meta.image)
				setMintedNFT(image)
				// console.log(mintedNFT)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
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
				<button
					className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={mintCharacter}
				>
					Mint Brydge NFT for 0.001 ETH
				</button>
			)}
			{miningStatus === 1 ? (
				<img
				src={mintedNFT}
				alt=''
				className='h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out'
			/>
			) : (
				<div></div>
			)}
		</div>
	)
}

export default mint
