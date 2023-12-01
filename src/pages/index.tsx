import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SolScan</title>
        <meta
          name="description"
          content="SolScan"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
