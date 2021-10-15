import React, { useState, useEffect, } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { injected } from '@/variables/connector';
import { WalletConnectAction } from '@/redux/actions/WalletActions';

import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@/components/CustomButtons/Button.js";
import styles from "@/assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
const useStyles = makeStyles(styles);

const getLibrary = (provider) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}    

export default function ConnectWallet() {
    const dispatch = useDispatch();
    const classes = useStyles();

    const { isConnected, address, networkId, } = useSelector(
        (state) => state.userWallet
    );

    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React;
    const [ activatingConnector, setActivatingConnector ] = useState(null);

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector])

    const connectButton =
        classes.top +
        " " +
        classes.connectButton +
        " " +
        classNames({[classes.searchRTL]: rtlActive});

    const connectClick = (e) => {
        setActivatingConnector(injected);
        activate(injected);
        // dispatch(WalletConnectAction());
    };

    const showWalletAddress = (str) => {
        return str.substring(0, 6) + '...' + str.substring(str.length-4);
    };

    return (
        <Button
            color="white"
            aria-label="edit"
            round
            className={connectButton}
            onClick={connectClick}
            // disabled={isConnected}
        >
            { active ? showWalletAddress(address) : "CONNECT" }
        </Button>
    )
}