import useContract from "./useContract";

import UmblCore from "@/abis/UmblCore.json";

const useUmblCoreContract = () =>
  useContract(process.env.MIX_UMBL_CORE_ADDRESS, UmblCore, true);

export default useUmblCoreContract;