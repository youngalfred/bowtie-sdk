const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
const { uploadConfig, uploadFile: makeFileUploadFn, getFileData } = require("./fileUpload");
const { getAutoRoutes } = require("./auto");
const morgan = require("morgan")

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
if (!api_key) {
    console.log("You must pass your api key as an environment variable (BOWTIE_API_KEY) for the app to work as expected (unless you are using an integration token, in which case, you may remove this if clause).");
    process.exit(-1);
}

const app = express();
const uploadFile = makeFileUploadFn(BOWTIE_API_URL, api_key);

// development helpers
app.use(morgan('tiny'));
app.use(cors());


app.use(function (req, res, next) {
    var filename = path.basename(req.url);
    var extension = path.extname(filename);
    if (extension === ".js") console.log("The file " + filename + " was requested.");
    next();
});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb'}));

/* The static resources to be served to your customer.  If it has been
   built correctly, the demo implementation's content will be
   delivered as the "home page" of this server.  
*/

const STATIC_CONTENT = process.env.BOWTIE_STATIC_CONTENT;

if (!STATIC_CONTENT) {
    console.log("You must set the BOWTIE_STATIC_CONTENT environment variable to serve a Bowtie UI Demo. You can easily serve a demo project by going to the root folder of one of the projects (angular/, vanilla-js/, etc...) and running: `npm run server`");
    process.exit(-1);
}
app.use(express.static(STATIC_CONTENT));

/* 
   This is the primary request/response proxy cycle.  After the customer
   submits the form, your instance will forward the content to the 
   Bowtie API, using your private IDs.
*/
app.post("/file", uploadConfig.any(), async (req, res) => {
    let fileName, buffer;
    try {
        const { buffer: fileBuffer, originalname } = getFileData(req);
        fileName = originalname;
        buffer = fileBuffer;
    } catch (err) {
        return res.status(400).send({
            message: "You must include a file to upload.",
        });
    }

    const formData = new FormData();
    formData.append("content", buffer);
    formData.append("fileName", fileName);

    try {
        const result = await uploadFile(
            formData,
            formData.getHeaders(),
        );
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        console.log("--File upload error above.")
        return res.status(500).json({ message: "Unknown server error." });
    }
});

app.post("/portfolio/submit", (req, res) => {
    const { application } = req.body;
    console.log("Request:\n\n", JSON.stringify(application, null, 2));

    axios
        .post(`${BOWTIE_API_URL}/v1/portfolio`, application, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "bowtie-api-version": req.headers["bowtie-api-version"], // automatically sent by the sdk
            },
        })
        .then((result) => {
            // This information is forwarded to the client.  The
            // resulting portfolioId can be used to retrieve the
            // portfolio.
            res.status(202).json({
                message: "Portfolio was successfully submitted",
                portfolioId: result.data.objectId,
            });
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

app.get("/portfolio/status", (req, res) => {
    const portfolioId = req.query.id;
    if (portfolioId === undefined) {
        res.status(400).json({ message: "Portfolio id was not provided" });
    } else {
        axios
            .get(`${BOWTIE_API_URL}/v1/portfolio_status?portfolioId=${portfolioId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": api_key,
                },
            })
            .then((result) => {
                const status = result.data.portfolioStatus;
                res.status(200).json(status);
            })
            .catch((error) => {
                console.log("Error: ", error);
                res.status(500).json({ message: "Internal server error." });
            });
    }
});

app.use("/auto", getAutoRoutes(BOWTIE_API_URL, api_key))


// Serve the index.html (for client-side routing to take place)
// when the url is unrecognized
app.use((_req, res) => {
    res.sendFile(path.join(__dirname, STATIC_CONTENT, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Bowtie proxy server listening at http://localhost:${PORT}`);
    if (process.env.NODE_ENV) {
        console.log("NODE_ENV: " + process.env.NODE_ENV);
    }
});