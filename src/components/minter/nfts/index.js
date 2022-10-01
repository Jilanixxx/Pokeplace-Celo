import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddCard from "./AddCard";
import PokeCard from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
	getNfts,
	createNft,
	buyCard,
	sellCard,
	unlistCard,
	deleteCard,
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const Cards = ({ minterContract, updateBalance, name }) => {
	/* performActions : used to run smart contract interactions in order
	 *  address : fetch the address of the connected wallet
	 */
	const { performActions, address } = useContractKit();
	const [nfts, setNfts] = useState([]);
	const [loading, setLoading] = useState(false);

	const getAssets = useCallback(async () => {
		try {
			setLoading(true);

			// fetch all nfts from the smart contract
			const allNfts = await getNfts(minterContract);
			if (!allNfts) return;
			setNfts(allNfts);
		} catch (error) {
			console.log({ error });
		} finally {
			setLoading(false);
		}
	}, [minterContract]);

	const addNft = async (data) => {
		try {
			setLoading(true);
			// create an nft functionality
			await createNft(minterContract, performActions, data);
			toast(<NotificationSuccess text="Pokecard added successfully." />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to add Pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	const buyNft = async (index, price) => {
		try {
			setLoading(true);

			// create an nft functionality
			await buyCard(minterContract, performActions, index, price);
			toast(<NotificationSuccess text="Pokecard bought successfully" />);
			getAssets();
			updateBalance();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to purchase pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	const sellNft = async (index, price) => {
		try {
			setLoading(true);
			// create an nft functionality
			await sellCard(minterContract, performActions, index, price);
			toast(<NotificationSuccess text="Buying card...." />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to buy card." />);
		} finally {
			setLoading(false);
		}
	};
	const unlistNft = async (index) => {
		try {
			setLoading(true);

			// create an nft functionality
			await unlistCard(minterContract, performActions, index);
			toast(<NotificationSuccess text="Pokecard unlisted successfully" />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to unlist pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	const burnNft = async (index) => {
		try {
			setLoading(true);

			// create an nft functionality
			await deleteCard(minterContract, performActions, index);
			toast(<NotificationSuccess text="Pokecard removed successfully" />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to remove pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		try {
			if (address && minterContract) {
				getAssets();
			}
		} catch (error) {
			console.log({ error });
		}
	}, [minterContract, address, getAssets]);
	if (address) {
		return (
			<>
				{!loading ? (
					<>
						<div className="d-flex justify-content-between align-items-center mb-4">
							<h1 className="fs-4 fw-bold mb-0">{name}</h1>
							<AddCard save={addNft} address={address} />
						</div>
						<Row
							xs={1}
							sm={2}
							lg={3}
							className="g-3  mb-5 g-xl-4 g-xxl-5"
						>
							{/* display all NFTs */}
							{nfts.map((_nft) => {
								// prevents empty cards(deleted cards) from breaking the app
								if(typeof _nft === "undefined"){
										return "";
								}else{
									return (
									<PokeCard
									key={_nft.tokenId}
									card={{
										..._nft,
									}}
									address={address}
									buyNft={buyNft}
									sellNft={sellNft}
									burnNft={burnNft}
									unlistNft={unlistNft}
									/>
									)
							}})}
						</Row>
					</>
				) : (
					<Loader />
				)}
			</>
		);
	}
	return null;
};

export default Cards;
