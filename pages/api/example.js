import { ethers } from "ethers";
import {contract_abi} from "../../common/utils/contract_abi.json"


export default async function handler(req, res) {
    console.log(contract_abi)
    const contract = await new ethers.Contract( process.env.NEXT_PUBLIC_CONTRACT_JKIDS , abi , req.query.provider ); 
    res.status(200).json({isCool: false});


}
