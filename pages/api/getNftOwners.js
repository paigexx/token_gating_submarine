import axios from 'axios';
import { supabase } from '../../common/utils/supbase';

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
			await supabase.from('Unlocks')
			.insert([
				{address: user, token: token, success: true},
			])
			res.status(200).json({isOwned: true});
			}
		else{
			await supabase.from('Unlocks')
			.insert([
				{address: user, token: token, success: false},
			])
			res.status(200).json({isOwned: false});
		}
	} catch (error) {
		console.error(error.response);
	}
}
