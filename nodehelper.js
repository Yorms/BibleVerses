const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for MMM-DailyDevotional...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_DEVOTIONAL") {
            this.fetchDevotional(payload.apiUrl, payload.apiKey);
        }
    },

    fetchDevotional: async function (apiUrl, apiKey) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: {} // Add any inputs required for the BrowseAI robot
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            const devotionalText = data.output.text; // Adjust based on the API response structure

            this.sendSocketNotification("DEVOTIONAL_RESULT", { text: devotionalText });
        } catch (error) {
            console.error("Error fetching devotional:", error);
        }
    }
});
