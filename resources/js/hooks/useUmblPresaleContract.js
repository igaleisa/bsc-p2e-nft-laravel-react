import useContract from "./useContract";

import UmblPresale from "@/abis/UmblPresale.json";

const useUmblPresaleContract = () =>
  useContract(process.env.MIX_UMBL_PRESALE_ADDRESS, UmblPresale, true);

export default useUmblPresaleContract;