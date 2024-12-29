# MML-DailyDevotional
Installation Steps:
Save the MMM-DailyDevotional module in the modules directory.
  cd ~/MagicMirror/modules
        git clone https://your-repository-link/MMM-DailyDevotional
        cd MMM-DailyDevotional
        npm install node-fetch

The sample from BrowseAI demonstrates a basic API call using the request library, which provides insights into the response structure and authorization mechanism. The key points here are:

    Authorization: The API key is passed as a Bearer token in the Authorization header.
    API Response Structure: The response body is returned in JSON format, which needs to be parsed and analyzed to extract relevant data.

I will update the MagicMirror module code to ensure it adheres to this structure and uses the Authorization header correctly. I’ll also replace the assumed data.output.text with a more flexible way to parse the API response.
Updated Module
node_helper.js

Here’s the revised node_helper.js to correctly handle the API response:

const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for: MMM-DailyDevotional");
    },

    socketNotificationReceived: async function (notification, payload) {
        if (notification === "FETCH_DEVOTIONAL") {
            this.fetchDevotional(payload.apiUrl, payload.apiKey);
        }
    },

    fetchDevotional: async function (apiUrl, apiKey) {
        console.log("Fetching devotional data from BrowseAI API...");
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`API response error: ${response.statusText}`);
            }

            const body = await response.json();
            console.log("Raw API response:", body);

            // Extract devotional content from the API response
            const devotionalText = this.parseDevotional(body);
            this.sendSocketNotification("DEVOTIONAL_RESULT", { text: devotionalText });
        } catch (error) {
            console.error("Error fetching devotional:", error);
            this.sendSocketNotification("DEVOTIONAL_RESULT", { text: "Error loading devotional." });
        }
    },

    parseDevotional: function (data) {
        // Update based on BrowseAI response structure
        if (data && data.results && data.results.length > 0) {
            return data.results[0].text || "No devotional text available.";
        }
        return "No devotional text available.";
    },
});

Key Changes

    Parsing API Response:
        The parseDevotional function processes the results array from the BrowseAI response.
        It assumes the first result in the array (results[0]) contains the devotional text in a text field.

    Error Handling:
        Added detailed error logging for better debugging.
        Ensures that even if the API response is empty or malformed, a fallback message is displayed.

    Request Structure:
        Updated to align with BrowseAI's example, ensuring the Authorization header uses the Bearer keyword.
