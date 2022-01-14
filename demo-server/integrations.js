const axios = require("axios");

const tlano_authorizer = "https://tlano-authorizer-api.dev-youngalfred.com";

const getIntegrationToken = async (token) => {
    const url = `${tlano_authorizer}/v1/integration_token?integrationToken=${token}`;

	try {
		const response = await axios.get(url);
		const integrationToken = response.data.integrationToken;
		if (!integrationToken) {
			throw new Error();
		}
		
		return {
			token: integrationToken.tokenId,
			partner_id: integrationToken.partnerId,
			integration_id: integrationToken.integrationId,
			enabled: integrationToken.enabled
		};
	} catch (error) {
		return {};
    }
};

const verifyIntegrationToken = async (req, res, next) => {
    const token = req.header("x-integration-token");
    const verifiedToken = await getIntegrationToken(token);

    if (verifiedToken) {
        if (!verifiedToken.enabled) {
            res.status(403).json({ message: "The integration token provided has been disabled by admin." });
            return;
        }
        res.locals.tokenData = {
            partnerId: verifiedToken.partner_id,
            integrationId: verifiedToken.integration_id,
            sessionId: verifiedToken.sessionId,
        };
        next();
        return;
    }

    res.status(403).json({ message: "A valid integration token was not sent." });
};

module.exports = { verifyIntegrationToken, getIntegrationToken };
