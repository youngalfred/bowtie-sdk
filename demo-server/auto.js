const express = require("express");
const axios = require("axios");

const findFirstMissingQueryParam = (params) => (
    Object.entries(params)
            .find(([_qpName, qpValue]) => !qpValue)?.[0]
);

const getErrorData = (error) => {
    const {
        response: {
            status = 500,
            data = { message: "Unknown server error." },
        } = {}
    } = error || {};

    return {
        status,
        data
    }
}

const getAutoRoutes = (apiBaseUrl = "", api_key = "") => {
    const router = express.Router();
    const url = `${apiBaseUrl}/v1/auto/`

    const retrieveAutoData = async (res, url, params = {}) => {
        const missingQueryParam = findFirstMissingQueryParam(params);
        if (missingQueryParam) {
            res.status(400).json({ message: `You must provide a ${missingQueryParam} query parameter in your request.` });
            return;
        }

        try {
            const { data } = await axios.get(url, {
                params,
                headers: {
                    "x-api-key": api_key
                }
            });
            res.status(200).json(data);
        } catch (error) {
            const { status, data } = getErrorData();
            res.status(status).json(data);
        }
    }

    router.get("/vin/:vinnumber", async (req, res) => {
        const { vinnumber = "" } = req.params;
        await retrieveAutoData(res, `${url}vin/${vinnumber}`)
    });

    router.get("/makes", async (req, res) => {
        const { year = "" } = req.query;
        const params = { year: `${year}` };

        await retrieveAutoData(res, `${url}makes`, params)
    });

    router.get("/models", async (req, res) => {
        const { year = "", make = "" } = req.query;
        const params = { year: `${year}`, make: `${make}` }

        await retrieveAutoData(res, `${url}models`, params)
    });

    router.get("/bodystyles", async (req, res) => {
        const { year = "", make = "", model = "" } = req.query;
        const params = { year: `${year}`, make: `${make}`, model: `${model}` };

        await retrieveAutoData(res, `${url}bodystyles`, params)
    });

    return router;
};

module.exports = {
    getAutoRoutes
}
