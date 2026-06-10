import { define } from "@/lib/utils.ts";
import { Footer } from "@/routes/(site)/(_components)/footer.tsx";
import { Header } from "@/routes/(site)/(_components)/header.tsx";

export default define.layout(({ Component, state }) => (
  <main>
    <Header locale={state.locale} />
    <Component />
    <Footer locale={state.locale} />
  </main>
));
