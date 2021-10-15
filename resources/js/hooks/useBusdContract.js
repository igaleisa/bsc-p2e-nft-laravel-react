import useContract from "./useContract";

import busdApi from "@/abis/Busd.json";

// let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]

const useBusdContract = () =>
  useContract(process.env.MIX_BUSD_ADDRESS, busdApi, true);

export default useBusdContract;
