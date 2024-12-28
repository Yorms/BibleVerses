Module.register("MMM-Devotions", {
    defaults: {
        apiUrl: "http://developer.enewhope.org/api/bible.php>Online Devotions", // Replace with your API URL
        apiKey: "", // Optional: API key for authentication
        updateInterval: 1000 * 60 * 60, // Update every hour
        morningTime: 6,
        eveningTime: 18
    },

    start: function () {
        this.currentDevotion = "";
        this.fetchDevotions();
        setInterval(() => {
            this.fetchDevotions();
        }, this.config.updateInterval);
    },

    fetchDevotions: function () {
        fetch(this.config.apiUrl, {
            headers: {
                "Authorization": `Bearer ${this.config.apiKey}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const currentHour = new Date().getHours();
                this.currentDevotion = currentHour >= this.config.eveningTime || currentHour < this.config.morningTime
                    ? data.evening
                    : data.morning;
                this.updateDom();
            })
            .catch(error => console.error("Error fetching devotions:", error));
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "devotion-wrapper";
        wrapper.innerHTML = this.currentDevotion || "Loading...";
        return wrapper;
    }
});
