import { InjectedConnector } from "@web3-react/injected-connector";

// Add different connectors
export const injected = new InjectedConnector({
  // supportedChainIds: [1, 3, 4, 5, 42, 1337], // Change according to supported Network Ids
  // supportedChainIds: [97], // Change according to supported Network Ids
  supportedChainIds: [97], // Change according to supported Network Ids
  // supportedChainIds: [56], // Change according to supported Network Ids
});

