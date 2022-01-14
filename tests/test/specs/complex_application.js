const application = require("../application").application;

const config = {
    host: "http://localhost:3002/",
};

describe("Simple application form submission", () => {
    it("Should submit application form for home", () => {
        browser.url(config.host);
        browser.setTimeout({ script: 300000 });
        const body = $("body");

        for (let line_item of application) {
            const reference_name = line_item[0];
            const value = line_item[1];
            const el = body.$(`[data-automation-id="${reference_name}"]`);
            const tagname = (el.getTagName() || "").toLowerCase();
            expect(tagname).not.toEqual("");
            el.scrollIntoView();

            if (tagname.toLowerCase() === "select") {
                el.selectByVisibleText(value);
                continue;
            }

            if (tagname.toLowerCase() === "input") {
                if (el.getAttribute("type") === "radio") {
                    el.click();
                    continue;
                }
                if (el.getAttribute("type") === "checkbox") {
                    if (value === "Yes") {
                        el.click();
                    }
                    continue;
                }

                el.click();
                body.$(`[data-automation-id="${reference_name}"]`).setValue(value);
                browser.keys("\t");
            }
        }

        $("#ya-submit-button").click();
        $("#success-message").waitForExist({ timeout: 5000 });
        expect($("#success-message")).toHaveTextContaining("Your application has successfully been sent");
    });
});
