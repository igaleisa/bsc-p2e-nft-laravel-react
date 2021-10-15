import React, { useState, useEffect, } from "react";
import { useDispatch, } from 'react-redux';

import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { injected } from '@/utils/connectors';
import { useEagerConnect, useInactiveListener } from '@/hooks';

import { makeStyles } from "@material-ui/core/styles";
import styles from "@/assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
import Button from "@/components/CustomButtons/Button.js";

const useStyles = makeStyles(styles);

import * as ActionTypes from '@/redux/ActionTypes';

export default function ConnectButton() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();
    const [ activatingConnector, setActivatingConnector ] = useState(null);
    const buttonStyle = classes.top + " " + classes.connectButton;

    const getErrorMessage = (error) => {
        if (error instanceof NoEthereumProviderError) {
            return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
        } else if (error instanceof UnsupportedChainIdError) {
            return "You're connected to an unsupported network.";
        } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect ||
            error instanceof UserRejectedRequestErrorFrame
        ) {
            return '1234 Please authorize this website to access your Ethereum account.';
        } else {
            console.error(error);
            return 'An unknown error occurred. Check the console for more details.';
        }
    }

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    useEffect(() => {
        if(!!error) {
            const errMsg = getErrorMessage(error);
            console.log(errMsg);
            // dispatch({type: ActionTypes.WALLET_CONNECT_ERROR, payload: {
            //     error: errMsg
            // }});
        } 
        
        if(active) {
            console.log('123123123123123123');
            dispatch({type: ActionTypes.WALLET_CONNECT_SUCCESS, payload: {
                chainId: chainId,
                account: account,
                active: active
            }});
        }    
    }, [active, error]);

    useEffect(() => {
        window.ethereum.enable();
    }, []);

    const handleButtonClick = async (e) => {
        if(!active) {
            dispatch({type: ActionTypes.RESTART_WALLET_CONNECT});
            setActivatingConnector(injected);
            await activate(injected);
        } else {
            dispatch({type: ActionTypes.WALLET_DISCONNECT_START});
            deactivate();
            dispatch({type: ActionTypes.WALLET_DISCONNECT_SUCCESS});
        }        
    };

    const showWalletAddress = (str) => {
        return str.substring(0, 6) + '...' + str.substring(str.length-4);
    };

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector);

    return (
        <Button
            color="white"
            aria-label="edit"
            round
            className={buttonStyle}
            onClick={handleButtonClick}
            // disabled={isConnected}
        >
            { account !== null && account && active ? showWalletAddress(account) : "CONNECT" }
        </Button>
    )
}