import { Head } from "fresh/runtime";
import { NotFound } from "@/components/not-found.tsx";
import { define } from "@/lib/utils.ts";

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
