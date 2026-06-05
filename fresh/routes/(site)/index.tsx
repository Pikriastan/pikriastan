import { Head } from "fresh/runtime";
import { define } from "@/lib/utils.ts";

export default define.page(function Home() {
  return (
    <div class="fresh-gradient mx-auto min-h-screen px-4 py-8">
      <Head>
        <title>Pikriastan</title>
      </Head>
      <div class="mx-auto flex max-w-3xl flex-col items-center justify-center">
        hello world
      </div>
    </div>
  );
});
