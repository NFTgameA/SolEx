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
        <img style={{ borderRadius: "20px" }} src="./banner.png" alt="logo" className="xl:max-w-xl h-[550px] object-cover" />

      </div>
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195] h-14 ">
          ⛏️ Start Mining BNB on SOL!
          {/* <span className='text-sm font-normal align-top text-slate-700'>v{pkg.version}</span> */}
        </h1>

        <div className="flex flex-row">
        

          <a href="https://twitter.com/BNB_Solana"><svg className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
            <linearGradient id="iS8U25XJCb2VBQOwbuAcra_bYzsf9Bmocst_gr1" x1="32" x2="32" y1="9.936" y2="52.195" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#iS8U25XJCb2VBQOwbuAcra_bYzsf9Bmocst_gr1)" d="M57.595,16.086c-0.286-0.341-0.762-0.45-1.17-0.271c-0.614,0.271-1.245,0.512-1.891,0.719 c0.824-1.035,1.462-2.216,1.874-3.491c0.127-0.396-0.002-0.827-0.326-1.087c-0.324-0.261-0.774-0.295-1.131-0.083 c-1.777,1.041-3.672,1.788-5.641,2.223C47.244,12.122,44.449,11,41.555,11c-6.169,0-11.189,4.978-11.189,11.097 c0,0.404,0.022,0.81,0.067,1.214c-7.41-0.705-14.289-4.343-19.027-10.103c-0.207-0.252-0.518-0.385-0.85-0.362 c-0.325,0.025-0.618,0.207-0.784,0.488c-0.993,1.679-1.519,3.613-1.519,5.593c0,2.447,0.807,4.78,2.247,6.68 c-0.292-0.123-0.579-0.26-0.859-0.412c-0.311-0.167-0.686-0.161-0.988,0.021c-0.303,0.181-0.488,0.507-0.488,0.859v0.119 c0,3.708,1.868,7.073,4.786,9.104c-0.012-0.002-0.024-0.005-0.036-0.007c-0.35-0.065-0.699,0.062-0.93,0.327 c-0.231,0.265-0.306,0.631-0.198,0.966c1.182,3.648,4.149,6.371,7.769,7.332c-3.003,1.771-6.401,2.697-9.957,2.697 c-0.786,0-1.563-0.046-2.308-0.137c-0.467-0.059-0.906,0.218-1.063,0.657c-0.157,0.44,0.012,0.931,0.407,1.181 C11.478,51.38,17.064,53,22.79,53c18.772,0,29.989-15.119,29.989-29.736c0-0.271-0.005-0.541-0.014-0.81 c1.907-1.423,3.552-3.159,4.896-5.169C57.908,16.915,57.881,16.427,57.595,16.086z M51.167,21.143 c-0.279,0.197-0.438,0.523-0.422,0.865c0.02,0.415,0.034,0.834,0.034,1.256C50.779,36.897,40.31,51,22.79,51 c-3.982,0-7.894-0.84-11.499-2.452c4.226-0.321,8.198-1.85,11.575-4.468c0.335-0.26,0.47-0.702,0.336-1.104 s-0.506-0.677-0.93-0.686c-3.381-0.065-6.404-1.952-7.948-4.835c1.115,0.038,2.203-0.099,3.276-0.393 c0.447-0.123,0.751-0.537,0.735-1c-0.017-0.464-0.35-0.854-0.804-0.945c-3.773-0.752-6.632-3.773-7.244-7.449 c1.122,0.403,2.297,0.631,3.468,0.667c0.459,0.011,0.848-0.271,0.983-0.696c0.136-0.426-0.027-0.89-0.399-1.137 c-2.558-1.698-4.084-4.53-4.084-7.575c0-1.135,0.21-2.25,0.614-3.287c5.319,5.827,12.784,9.361,20.714,9.76 c0.328,0.022,0.617-0.116,0.817-0.357c0.202-0.241,0.278-0.563,0.207-0.868c-0.16-0.685-0.24-1.384-0.24-2.077 c0-5.016,4.122-9.097,9.189-9.097c2.537,0,4.979,1.047,6.7,2.871c0.235,0.248,0.581,0.359,0.917,0.296 c1.385-0.267,2.739-0.671,4.048-1.209c-0.729,1.007-1.665,1.865-2.759,2.514c-0.407,0.242-0.589,0.735-0.436,1.184 c0.153,0.447,0.597,0.73,1.068,0.669c0.952-0.117,1.886-0.292,2.797-0.525C53.06,19.666,52.15,20.449,51.167,21.143z"></path><linearGradient id="iS8U25XJCb2VBQOwbuAcrb_bYzsf9Bmocst_gr2" x1="38.903" x2="38.903" y1="9.936" y2="52.195" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#iS8U25XJCb2VBQOwbuAcrb_bYzsf9Bmocst_gr2)" d="M30.772,45.786l0.621,1.9c7.123-2.326,12.824-7.914,15.642-15.33l-1.869-0.711 C43.636,35.671,39.733,42.859,30.772,45.786z"></path><g><linearGradient id="iS8U25XJCb2VBQOwbuAcrc_bYzsf9Bmocst_gr3" x1="42" x2="42" y1="17.979" y2="21.528" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6dc7ff"></stop><stop offset="1" stop-color="#e6abff"></stop></linearGradient><circle cx="42" cy="20" r="2" fill="url(#iS8U25XJCb2VBQOwbuAcrc_bYzsf9Bmocst_gr3)"></circle></g>
          </svg></a>

          <a href="https://t.me/BNB_Solana">
            <svg className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
              <linearGradient id="EEzBmxT86u8E~6vCqQtLma_114954_gr1" x1="29.5" x2="29.5" y1="19.006" y2="46" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#6dc7ff"></stop><stop offset="1" stop-color="#e6abff"></stop></linearGradient><path fill="url(#EEzBmxT86u8E~6vCqQtLma_114954_gr1)" d="M22.007,35.25L39.022,25L27.011,37.5l10.535,8.275c1.887,0.83,2.574-0.899,2.574-0.899 l4.825-24.501c0,0,0.082-0.625,0.045-0.75c-0.344-1.168-2.228-0.325-2.227-0.324L15.206,30.188c0,0-1.304,0.449-1.201,1.278 c0.103,0.83,1.167,1.209,1.167,1.209l6.837,2.575"></path><linearGradient id="EEzBmxT86u8E~6vCqQtLmb_114954_gr2" x1="29.5" x2="29.5" y1="5.833" y2="58.262" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#EEzBmxT86u8E~6vCqQtLmb_114954_gr2)" d="M45.949,19.343c-0.23-0.784-0.859-1.269-1.727-1.33c-0.175-0.013-1.159,0.027-1.823,0.365 l-0.003-0.007L14.881,29.243C13.996,29.547,13.02,30.266,13,31.33c-0.002,0.084,0.003,0.171,0.014,0.26 c0.173,1.4,1.654,1.968,1.807,2.021l6.377,2.402c0.49,1.575,2.108,6.774,2.456,7.886c0.234,0.744,0.62,1.709,1.327,1.973 C25.185,45.956,25.402,46,25.628,46c0.614,0,1.014-0.312,1.163-0.447l3.903-3.89l6.235,4.897c0.065,0.052,0.138,0.096,0.215,0.129 c0.517,0.228,0.976,0.31,1.367,0.31c0.409,0,0.745-0.089,0.998-0.193c1.067-0.438,1.494-1.447,1.54-1.561 c0.022-0.057,0.04-0.116,0.052-0.176l4.835-24.564C46.047,19.669,45.987,19.472,45.949,19.343z M23.195,35.701l9.872-5.947 l-6.775,7.053c-0.12,0.124-0.188,0.279-0.229,0.442c-0.003,0.012-1.006,4.43-1.006,4.43L23.195,35.701z M43.963,20.188l-4.799,24.37 c-0.057,0.098-0.2,0.311-0.413,0.398c-0.179,0.073-0.412,0.055-0.694-0.053l-9.559-7.507l11.245-11.704 c0.348-0.361,0.374-0.925,0.061-1.316c-0.312-0.391-0.867-0.491-1.297-0.232l-16.601,10l-6.389-2.406 c-0.196-0.075-0.398-0.221-0.481-0.323c0.109-0.096,0.329-0.221,0.537-0.296L43.131,20.23c0.017-0.006,0.033-0.014,0.05-0.021 c0.251-0.11,0.59-0.192,0.803-0.205C43.974,20.104,43.963,20.187,43.963,20.188z"></path><linearGradient id="EEzBmxT86u8E~6vCqQtLmc_114954_gr3" x1="32" x2="32" y1="5.833" y2="58.262" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#EEzBmxT86u8E~6vCqQtLmc_114954_gr3)" d="M32,58C17.663,58,6,46.336,6,32S17.663,6,32,6s26,11.664,26,26S46.337,58,32,58z M32,8 C18.767,8,8,18.767,8,32s10.767,24,24,24s24-10.767,24-24S45.233,8,32,8z"></path>
            </svg>
          </a>
        </div>

        <h4 className="md:w-full text-center text-slate-300 my-2 max-w-sm">
          These NFTs Allow you to earn the SPL Token "BNB on SOL" on the Solana network. Each staking validator will earn BNB. Validator with more node will earn more rewards. Node validator cost doubles every 358 nodes minted.<br/><b> <i className="text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">The larger the amount of SOL you invest, the more tokens you'll earn. </i></b>
        </h4>
        <div className="max-w-md mx-auto mockup-code bg-primary p-6 my-2">
          <pre data-prefix=">">
            <code className="truncate">Start earning on Solana  </code>

          </pre>
          <pre data-prefix=">">
            <code className="truncate">Estimated costs : 0.1 SOL </code>

            <pre data-prefix=">">
              <code className="truncate">Enter SOL amout  </code>

            </pre>


            <code className="truncate">  {wallet && <p>SOL Balance: {(balance || 0).toLocaleString()}</p>}  </code>



            {/* <SendSol /> */}
            <MetaLex />
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
