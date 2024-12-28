Module.register("MMM-Devotional", {
    defaults: {
        apiUrl: "https://api.browse.ai/v2/tasks/{inser_Robot_ID}/run", // Replace {robot_id} with your BrowseAI Robot ID
        apiKey: "", // Replace with your BrowseAI API Key
        updateInterval: 24 * 60 * 60 * 1000 // Update every 24 hours
    },

    start: function () {
        this.devotional = "Loading...";
        this.getData();
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    getData: function () {
        this.sendSocketNotification("FETCH_DEVOTIONAL", {
            apiUrl: this.config.apiUrl,
            apiKey: this.config.apiKey
        });
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "DEVOTIONAL_RESULT") {
            this.devotional = payload.text; // Assuming the API returns `text` for the devotional
            this.updateDom();
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "devotional-wrapper";
        wrapper.innerHTML = this.devotional || "No devotional available";
        return wrapper;
    }
});
