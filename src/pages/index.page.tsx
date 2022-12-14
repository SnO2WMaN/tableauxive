import { css } from "@emotion/css";
import katex from "katex";
import ky from "ky";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { Branch } from "~/components/Branch";
import { BranchType, PropInference, SolveApiResult } from "~/types";
import { toTexPropInference } from "~/utils/toTeX";

export type PageProps =
  | { result: null }
  | { result: { type: "prop"; inference: PropInference; branch: BranchType; valid: boolean } };
export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
  const reqInference = query["inference"];
  if (!reqInference || Array.isArray(reqInference)) {
    return { props: { result: null } };
  }

  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  apiUrl.searchParams.set("logic", "prop");
  apiUrl.searchParams.set("inference", reqInference);

  console.log(apiUrl.toString());

  const apiRes = await ky.get(apiUrl.toString());
  if (apiRes.status === 400) throw new Error("Invalid formula");
  if (200 < apiRes.status) throw new Error("Something wrong");

  const { inference, branch, valid } = await apiRes.json<SolveApiResult>();
  return { props: { result: { type: "prop", inference, branch, valid } } };
};

const Page: NextPage<PageProps> = (props) => {
  return (
    <>
      <Head>
        <title>Tableauxive</title>
      </Head>
      <div className={css({ padding: "16px 24px" })}>
        {props.result && (
          <>
            <p className={css({ textAlign: "left" })}>
              <span
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(toTexPropInference(props.result.inference), { displayMode: false }),
                }}
              >
              </span>{" "}
              is{"  "}{props.result.valid ? <span>valid</span> : <span>invalid</span>}
              .
            </p>
            <div className={css({ marginBlockStart: "24px", display: "flex", justifyContent: "center" })}>
              <Branch branch={props.result.branch} />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Page;
