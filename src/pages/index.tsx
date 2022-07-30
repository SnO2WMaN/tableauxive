import Head from "next/head";
import React from "react";

import { branch } from "~/tableau/result";

import { Branch } from "../components/Branch";

const Page: React.FC = () => {
  return (
    <>
      <Head>
        <title>Tableauxive</title>
      </Head>
      <Branch branch={branch}></Branch>
    </>
  );
};
export default Page;
