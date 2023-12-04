import { FC } from 'react';
import Link from "next/link";
export const ContentContainer: FC = props => {

  return (
    <div className="flex-1 drawer h-52">
     {/* <div className="h-screen drawer drawer-mobile w-full"> */}
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="items-center  drawer-content bg" >
        {props.children}
      </div>

      {/* SideBar / Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="p-4 overflow-y-auto menu w-80 bg-base-100">
          <li>
            <h1>Menu</h1>
          </li>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {/* <li>
            <Link href="/explorer">
              <a>Explorer</a>
            </Link>
          </li> */}
          <li>
            <Link href="https://t.me/XRPonSolana">
              <a>Telegram</a>
            </Link>
          </li>
          <li>
            <Link href="https://twitter.com/XRP_on_SOL">
              <a>Twitter</a>
            </Link>
          </li>

          <li>
            <Link href="https://docs.solxrp.xyz/">
              <a>Docs</a>
            </Link>
          </li>

          
       
        </ul>
      </div>
    </div>
  );
};
