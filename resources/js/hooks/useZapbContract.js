import useContract from "./useContract";

import zapbApi from "@/abis/Zapb.json";

const useZapbContract = () =>
  useContract(process.env.MIX_ZAPB_ADDRESS, zapbApi, true);

export default useZapbContract;
