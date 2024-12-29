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
