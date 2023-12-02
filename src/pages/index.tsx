import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Mint BNB on SOL</title>
        <meta
          name="description"
          content="Mint BNB"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
