import React from "react";
import Web3 from 'web3'
import { Web3ReactProvider, } from '@web3-react/core';
import ConnectButton from "@/components/Wallet/ConnectButton";

const getLibrary = (provider) => {
    return new Web3(provider);
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;    
}    

export default function ConnectWallet() {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ConnectButton />
        </Web3ReactProvider>
    )
}