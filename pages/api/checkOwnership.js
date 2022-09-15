import { supabase } from '../../common/lib/supbase';
import { v4 as uuidv4 } from 'uuid';
import { withIronSession } from 'next-iron-session'
import {ironOptions} from "../../common/config/ironOptions";
import {contract_abi} from "../../common/utils/contract_abi"
import { ethers } from 'ethers';
import axios from 'axios';
import * as util from "ethereumjs-util";
const CID = process.env.NEXT_PUBLIC_PINATA_CID
const urlV2API = `https://managed.mypinata.cloud/api/v1`;


function withSession(handler) { 
	return withIronSession(handler, ironOptions)
}

export default withSession(async(req, res)=> {
	//Create signed message for user
	if(req.method === "GET") {
		try {
			const message = { contract: process.env.NEXT_PUBLIC_CONTRACT_JKIDS, id: uuidv4()}
			req.session.set('message-session', message)
			await req.session.save()
			res.json(message)
		} catch (error) {
			console.log(error);
			const { response: fetchResponse } = error
			res.status(fetchResponse?.status || 500).json(error.data)
		}
	}

	//Generate access token from valid signed message
	else if(req.method === "POST") {
		console.log("hi")
		try {
			const message = req.session.get('message-session')
			const provider = await new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_URL)
			const contract = await new ethers.Contract( process.env.NEXT_PUBLIC_CONTRACT_JKIDS , contract_abi , provider );    
			
			//use ethereum utils to get message and match address to user
			let nonce = "\x19Ethereum Signed Message:\n" + JSON.stringify(message).length + JSON.stringify(message)
			nonce = util.keccak(Buffer.from(nonce, "utf-8"))
			const { v, r, s } = util.fromRpcSig(req.body.signature)
			const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s)
			const addrBuf = util.pubToAddress(pubKey)
			const addr = util.bufferToHex(addrBuf)


			if(req.body.address.toLowerCase() === addr) {
				//check if address owns Nft via AlchemyAPI
				const response = await axios.get(`${process.env.NEXT_PUBLIC_ALCHEMY_URL}/getOwnersForToken?contractAddress=${process.env.NEXT_PUBLIC_CONTRACT_JKIDS}&tokenId=${req.body.tokenId}`);
				console.log(response)
				if(response.data.owners.includes(addr)) {
					// get submarined content :)
					const config = {
						headers: {
						"x-api-key": `${process.env.NEXT_PUBLIC_SUBMARINE_KEY}`, 
						'Content-Type': 'application/json'
						}
					}
					const content = await axios.get(`${urlV2API}/content`, config)
					const { data } = content;
					const { items } = data;
					const item = items.find(i => i.cid === CID);
					const body = {
							timeoutSeconds: 3600, 
							contentIds: [item.id] 
						}
					// get submarine token access for specific content item
					const token = await axios.post(`${urlV2API}/auth/content/jwt`, body, config);
					//add unlock to supabase
					await supabase.from('Unlocks').insert([{address: addr, token: req.body.tokenId, success: true}])
					return res.status(200).send(`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${process.env.NEXT_PUBLIC_PINATA_CID}?accessToken=${token.data}`);
				}
				else{ 
					//add failed unlock to supabase
					await supabase.from('Unlocks').insert([{address: addr, token: req.body.tokenId, success: false}])
					return res.status(401).send("You don't own Sun Tan Bird")
				}
			} 
			else {
				return res.status(401).send("Signature not Valid");
			}
		}
		catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}
})
