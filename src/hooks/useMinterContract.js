import {useContract} from './useContract';
import PokePlace from '../contracts/PokePlace.json';
import PokePlaceContractAddress from '../contracts/PokePlace-address.json';


// export interface for NFT contract
export const useMinterContract = () => useContract(PokePlace.abi, PokePlaceContractAddress.PokePlace);