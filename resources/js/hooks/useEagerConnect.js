import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { useDispatch, } from 'react-redux';
import { injected } from "@/utils/connectors";

const useEagerConnect = () => {
  const dispatch = useDispatch();
  
  const { activate, active, chainId, account } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
};

export default useEagerConnect;
