import React from "react";
import Web3 from 'web3'
import { Web3ReactProvider, } from '@web3-react/core';
import ConnectButton from "@/components/Connect/ConnectButton";

const getLibrary = (provider) => {
    return new Web3(provider);
}    

export default function ConnectWallet() {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ConnectButton />
        </Web3ReactProvider>
    )
}