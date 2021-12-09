const express = require("express");
const path = require("path");
const axios = require("axios");

/* This configuration information should use the _testing_ integration
   ID until you're ready to go live.  These IDs help to maintain the
   integrity and safety of all transactions.
*/

// Change this to just api.younglalfred.com when you're ready.
const BOWTIE_API_URL = process.env.BOWTIE_API_URL
    ? process.env.BOWTIE_API_URL
    : "https://bowtie-api-sandbox.youngalfred.com";

const PORT = process.env.BOWTIE_LOCAL_PORT ? process.env.BOWTIE_LOCAL_PORT : 3001;
const api_key = process.env.BOWTIE_API_KEY;

const app = express();

app.use(function (req, res, next) {
    var filename = path.basename(req.url);
    var extension = path.extname(filename);
    if (extension === ".js") console.log("The file " + filename + " was requested.");
    next();
});

app.use(express.json());

/* The static resources to be served to your customer.  If it has been
   built correctly, the demo implementation's content will be
   delivered as the "home page" of this server.  
*/

const STATIC_CONTENT = process.env.BOWTIE_STATIC_CONTENT
    ? process.env.BOWTIE_STATIC_CONTENT
    : path.join(__dirname, "../build");

app.use(express.static(STATIC_CONTENT));

/* 
   This is the primary request/response proxy cycle.  After the customer
   submits the form, your instance will forward the content to the 
   Bowtie API, using your private IDs.
*/

app.post("/portfolio/submit", (req, res) => {
    const requestData = req.body.data;
    console.log("Request:\n\n", JSON.stringify(req.body, null, 2));
    axios
        .post(`${BOWTIE_API_URL}/v1/portfolio`, requestData, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": api_key,
            },
        })
        .then((result) => {
            // This information is forwarded to the client.  The
            // resulting portfolioId can be used to retrieve the
            // portfolio.
            const data = result.data;
            if ("validationResult" in data && data.validationResult.length > 0) {
                res.status(400).json({
                    message: "Portfolio was not successfully submitted",
                    portfolioId: data.objectId,
                    kind: "failure",
                    errors: data.validationResult.map(({ field, path, title, detail }) => ({
                        field: `${path || "?"}.${field || "?"}`,
                        title: title || "?",
                        detail: detail || "?",
                    })),
                });
            } else {
                res.status(202).json({
                    message: "Portfolio was successfully submitted",
                    portfolioId: result.data.objectId,
                    kind: "success",
                });
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 400) {
                console.log("Errors:\n\n", JSON.stringify(error.response.data, null, 2));
                res.status(400).json({
                    message: "Invalid data",
                    errors: error.response.data.errors.map(function (e) {
                        return { field: e.source, message: e.detail };
                    }),
                    kind: "validation-failure",
                });
            } else {
                console.error("Internal server error submitting portfolio:\n", error.toString());
                res.status(500).json({ message: "Server error. Please contact an administrator." });
            }
        });
});

app.listen(PORT, () => {
    console.log(`Bowtie proxy server listening at http://localhost:${PORT}`);
    if (process.env.NODE_ENV) {
        console.log("NODE_ENV: " + process.env.NODE_ENV);
    }
});
