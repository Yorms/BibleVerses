const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for: MMM-DailyDevotional");
    },

    socketNotificationReceived: async function (notification, payload) {
        if (notification === "FETCH_DEVOTIONAL") {
            this.fetchDevotional(payload.apiUrl, payload.apiKey, payload.originUrl);
        }
    },

    fetchDevotional: async function (apiUrl, apiKey, originUrl) {
        console.log("Fetching devotional data from BrowseAI API...");

        try {
            // Use dynamic import to fetch `fetch` function if required
            const { fetch } = globalThis; // Use native fetch if available
            if (!fetch) {
                globalThis.fetch = (await import("node-fetch")).default;
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: { originUrl } }),
            });

            if (!response.ok) {
                throw new Error(`API response error: ${response.statusText}`);
            }

            const body = await response.json();
            console.log("Raw API response:", body);

            // Parse devotional text from the API response
            const devotionalText = this.parseDevotional(body);
            this.sendSocketNotification("DEVOTIONAL_RESULT", { text: devotionalText });
        } catch (error) {
            console.error("Error fetching devotional:", error);
            this.sendSocketNotification("DEVOTIONAL_RESULT", { text: "Error loading devotional." });
        }
    },

    parseDevotional: function (data) {
        // Extract devotional text based on BrowseAI response structure
        if (data && data.results && data.results.length > 0) {
            return data.results[0].text || "No devotional text available.";
        }
        return "No devotional text available.";
    },
});
