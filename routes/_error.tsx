import { NotFound } from "@/components/not-found.tsx";
import { define } from "@/lib/utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function NotFoundPage({ state }) {
  return (
    <>
      <Head>
        <title>Pikriastan \u2014 404</title>
      </Head>
      <NotFound locale={state.locale} />
    </>
  );
});
