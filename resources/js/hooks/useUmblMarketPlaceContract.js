import useContract from "./useContract";

import UmblMarketPlace from "@/abis/UmblMarketPlace.json";

const useUmblMarketPlaceContract = () =>
  useContract(process.env.MIX_UMBL_MARKET_ADDRESS, UmblMarketPlace, true);

export default useUmblMarketPlaceContract;
