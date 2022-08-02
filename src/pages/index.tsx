import { css } from "@emotion/css";
import ky from "ky";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Suspense } from "react";
import useSWR from "swr";

import { Branch } from "~/components/Branch";
import { Branch as BranchType } from "~/tableau/result";

export const Tableau: React.FC = () => {
  const { data } = useSWR(
    `http://localhost:3000/api/solve`,
    (url) => ky.get(url).json<BranchType>(),
    { suspense: true },
  );

  return (
    <div>
      <div className={css({ display: "flex", justifyContent: "center" })}>
        <Branch
          branch={
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data!
          }
        />
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const router = useRouter();
  const { formula } = router.query;

  return (
    <>
      <Head>
        <title>Tableauxive</title>
      </Head>
      <span>{formula}</span>
      <Suspense fallback={<div>loading</div>}>
        <Tableau></Tableau>
      </Suspense>
    </>
  );
};
export default Page;
