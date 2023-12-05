// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';

import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { GetTokens } from 'components/GetTokens';
import { MetaLex } from "components/re";
import { Unstake } from "components/unstake";
import Image from "next/image";
export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (


    <div style={{ display: "flex", alignItems: "center" }} className="md:hero mx-auto p-4 flex-col  justify-center flex lg:flex-row">
      <div className="" style={{ borderRadius: "20px" }}>
        <img style={{ borderRadius: "20px" ,boxShadow:"0 0 5px 5px #ffffd6;" }} src="./mintbnb.png" alt="logo" className="xl:max-w-2xlxl h-[650px] object-cover shadow-lg" />

      </div>
      <div className="md:hero-content flex flex-col">
        <div style={{lineHeight:"unset"}} className="text-center text-4xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14ddf1] ">
          ⛏️ Start mining BNB Built on SOL <br /> and receive free NFTs
          {/* <span className='text-sm font-normal align-top text-slate-700'>v{pkg.version}</span> */}
        </div>

        <div className="flex flex-row justify-center">
      

          <a href="https://twitter.com/BNB_onSolana">

          <svg className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#03a9f4" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path><path fill="#fff" d="M36,17.12c-0.882,0.391-1.999,0.758-3,0.88c1.018-0.604,2.633-1.862,3-3	c-0.951,0.559-2.671,1.156-3.793,1.372C29.789,13.808,24,14.755,24,20v2c-4,0-7.9-3.047-10.327-6c-2.254,3.807,1.858,6.689,2.327,7	c-0.807-0.025-2.335-0.641-3-1c0,0.016,0,0.036,0,0.057c0,2.367,1.661,3.974,3.912,4.422C16.501,26.592,16,27,14.072,27	c0.626,1.935,3.773,2.958,5.928,3c-2.617,2.029-7.126,2.079-8,1.977c8.989,5.289,22.669,0.513,21.982-12.477	C34.95,18.818,35.342,18.104,36,17.12"></path>
</svg>
          </a>

          <div className="px-2"></div>

          <a href="https://t.me/BNB_onSOL">
          <svg className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#29b6f6" d="M24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20S35,4,24,4z"></path><path fill="#fff" d="M34,15l-3.7,19.1c0,0-0.2,0.9-1.2,0.9c-0.6,0-0.9-0.3-0.9-0.3L20,28l-4-2l-5.1-1.4c0,0-0.9-0.3-0.9-1	c0-0.6,0.9-0.9,0.9-0.9l21.3-8.5c0,0,0.7-0.2,1.1-0.2c0.3,0,0.6,0.1,0.6,0.5C34,14.8,34,15,34,15z"></path><path fill="#b0bec5" d="M23,30.5l-3.4,3.4c0,0-0.1,0.1-0.3,0.1c-0.1,0-0.1,0-0.2,0l1-6L23,30.5z"></path><path fill="#cfd8dc" d="M29.9,18.2c-0.2-0.2-0.5-0.3-0.7-0.1L16,26c0,0,2.1,5.9,2.4,6.9c0.3,1,0.6,1,0.6,1l1-6l9.8-9.1	C30,18.7,30.1,18.4,29.9,18.2z"></path>
</svg>
          </a>
        </div>

        <h4 className="md:w-full text-center text-slate-300 my-2 lg:max-w-lg bg-[#2a2a2a] p-1 rounded">
          These NFTs Allow you to earn the SPL Token "BNB Built on Solana" on the Solana network. Each staking validator will earn BNB. Validator with more node will earn more rewards. Node validator cost doubles every 358 nodes minted.<br/><b> <i className="text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14ddf1]">The mining Pool (or wallet) that solves the block first, gets the reward. </i></b>
        </h4>
        <div className="max-w-md mx-auto mockup-code bg-primary p-6 my-2 " style={{backgroundImage:"linear-gradient(var(--gradient-rotate, 246deg), #da2eef 7.97%, #2b6aff 49.17%, #39d0d8 92.1%);"}}>
          <pre data-prefix="💥">
            <code className="truncate">Start earning on Solana  </code>

          </pre>
          <pre data-prefix="💥">
            <code className="truncate">Block reward: 50 $BNB Built on Solana </code>

            <pre data-prefix="💥">
              <code className="truncate">Enter SOL amout  </code>

            </pre>


            <code className="truncate">  {wallet && <p>SOL Balance: {(balance || 0).toLocaleString()}</p>}  </code>



            {/* <SendSol /> */}
            <MetaLex />
            <Unstake/>
          </pre>
        </div>
        <div className="text-center">
          {/* <RequestAirdrop /> */}
          {/* {wallet.publicKey && <p>Public Key: {wallet.publicKey.toBase58()}</p>} */}
          {/* {wallet && <p>SOL Balance: {(balance || 0).toLocaleString()}</p>} */}
        </div>
        <div>
          {/* <GetTokens /> */}

        </div>
      </div>
    </div>
  );
};
