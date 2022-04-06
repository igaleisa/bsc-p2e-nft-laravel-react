import useContract from "./useContract";

import UmblPublicSale from "@/abis/UmblPublicSale.json";

const useUmblPublicSaleContract = () =>
  useContract(process.env.MIX_UMBL_PUBLIC_ADDRESS, UmblPublicSale, true);

export default useUmblPublicSaleContract;