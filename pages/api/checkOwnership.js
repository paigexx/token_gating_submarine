import axios from 'axios';
import { supabase } from '../../common/utils/supbase';
import { submarine } from '../../common/utils/submarine';

export default async function handler(req, res) {
	const user = req.query.userAddress.toLowerCase()
	const token = req.query.tokenId
	const options = {
		method: 'GET',
		url: `${process.env.NEXT_PUBLIC_ALCHEMY_URL}/getOwnersForToken?contractAddress=${req.query.contractAddress}&tokenId=${token}`
	};
	try {
		let response = await axios(options);
		if(response.data.owners.includes(user)){
			try {
				await supabase.from('Unlocks')
				.insert([{address: user, token: token, success: true}])
				const cid = process.env.NEXT_PUBLIC_PINATA_CID;
				const foundContent = await submarine.getSubmarinedContentByCid(cid);
				const folder = foundContent.items[0];
				const folderId = folder.id;
				const timeInSeconds = 3600 //one hour
				const link = await submarine.generateAccessLink(timeInSeconds, folderId, cid);
				res.status(200).json({success: true, isOwned: true, submarineLink: link });
			} catch (error) {
				console.log("Error", error.response)
				res.status(500).json({success: false });
			}
		}
		else{
			try {
				await supabase.from('Unlocks')
				.insert([{address: user, token: token, success: false}])
			} catch (error) {
				console.log("Error", error.response)
			}
			res.status(200).json({isOwned: false});
		}
	} catch (error) {
		console.error(error.response);
		res.status(500).json({success: false });
	}
}
