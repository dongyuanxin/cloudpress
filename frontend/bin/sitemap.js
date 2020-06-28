#!/usr/bin/env node
const path = require("path");
const sitemap = require("nextjs-sitemap-generator");

sitemap({
    baseUrl: "https://www.cloudbase.net",
    pagesDirectory: path.join(__dirname, "..", "out"),
    targetDirectory: path.join(__dirname, "..", "out"),
});
