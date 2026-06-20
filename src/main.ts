import "./styles.css";
import { createGuideApp, createStaticContentProvider } from "./guidekit/index.ts";
import { sampleContent } from "./sample-content/index.ts";

void createGuideApp({
  root: "#app",
  provider: createStaticContentProvider(sampleContent),
});
