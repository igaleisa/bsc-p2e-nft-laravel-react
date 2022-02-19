import useContract from "./useContract";

import busdApi from "@/abis/Busd.json";

const useBusdContract = () =>
  useContract(process.env.MIX_BUSD_ADDRESS, busdApi, true);

export default useBusdContract;
