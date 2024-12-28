Module.register("MMM-Devotional", {
    defaults: {
        apiUrl: "https://api.browse.ai/v2/tasks/b70be40d-dad7-4713-81fa-bbd3cd6d9689/run", // Replace {robot_id} with your BrowseAI Robot ID
        apiKey: "f354afee-6e46-4651-a93d-064aa50785d4:b2d0528f-def0-4fde-8b6e-d4804e1e00bc", // Replace with your BrowseAI API Key
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
