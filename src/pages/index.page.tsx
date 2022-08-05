import { css } from "@emotion/css";
import katex from "katex";
import ky from "ky";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { Branch, MkTexExp } from "~/components/Branch";
import { BranchType, PropFormula, SolveApiResult } from "~/types";

export type PageProps =
  | { result: null }
  | { result: { formula: PropFormula; branch: BranchType; valid: boolean } };
export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
  const reqFormula = query["formula"];
  if (!reqFormula || Array.isArray(reqFormula)) {
    return { props: { result: null } };
  }

  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  apiUrl.searchParams.set("formula", reqFormula);

  const apiRes = await ky.get(apiUrl.toString());
  if (apiRes.status === 400) throw new Error("Invalid formula");
  if (200 < apiRes.status) throw new Error("Something wrong");

  const { formula, branch, valid } = await apiRes.json<SolveApiResult>();
  return { props: { result: { formula, branch, valid } } };
};

const Page: NextPage<PageProps> = (props) => {
  return (
    <>
      <Head>
        <title>Tableauxive</title>
      </Head>
      {props.result && (
        <>
          <p className={css({ textAlign: "center" })}>
            <span
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(MkTexExp(props.result.formula), { displayMode: false }),
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
    </>
  );
};
export default Page;
