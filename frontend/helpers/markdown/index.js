import Markdownit from "markdown-it";
import { highlight } from "./highlight";
import { plugins } from "./plugin";
import { parseAnchors } from "./toc";

const md = Markdownit({
    highlight,
    html: true,
    breaks: true,
    linkify: true,
});

plugins.forEach((plugin) => md.use(...plugin));

export { md, parseAnchors };
