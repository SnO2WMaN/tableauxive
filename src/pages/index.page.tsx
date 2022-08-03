import { css } from "@emotion/css";
import ky from "ky";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React, { useMemo } from "react";
import useSWR from "swr";

import { Branch } from "~/components/Branch";
import { Branch as BranchType } from "~/tableau/result";

export const Tableau: React.FC = () => {
  const solveUrl = useMemo(() => {
    const url = new URL(
      "/api/solve",
      process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith("localhost")
        ? `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    );
    url.searchParams.set("formula", "P∧(P→Q)→Q");
    return url.toString();
  }, []);
  const { data } = useSWR(solveUrl, (url) => ky.get(url).json<BranchType>(), { suspense: true });

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

export type PageProps = { branch: BranchType };
export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
  const formula = query["formula"];
  if (!formula || Array.isArray(formula)) throw new Error("Formula is missing");

  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  apiUrl.searchParams.set("formula", formula);

  const apiRes = await ky.get(apiUrl.toString());
  if (apiRes.status === 400) throw new Error("Invalid formula");
  if (200 < apiRes.status) throw new Error("Something wrong");

  const branch = await apiRes.json<BranchType>();
  return { props: { branch } };
};

const Page: NextPage<PageProps> = (props) => {
  return (
    <>
      <Head>
        <title>Tableauxive</title>
      </Head>
      <div className={css({ display: "flex", justifyContent: "center" })}>
        <Branch branch={props.branch} />
      </div>
    </>
  );
};
export default Page;
