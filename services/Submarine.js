import { Submarine } from "pinata-submarine";
export const submarine = new Submarine(process.env.NEXT_PUBLIC_SUBMARINE_KEY, process.env.NEXT_PUBLIC_PINATA_GATEWAY);
