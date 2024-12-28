var config = {
    modules: [
        {
            module: "MMM-DailyDevotional",
            position: "middle_center", // Change position as needed
            config: {
                apiUrl: "https://api.browse.ai/v2/tasks/b70be40d-dad7-4713-81fa-bbd3cd6d9689/run", // Replace with your BrowseAI Robot URL
                apiKey: "f354afee-6e46-4651-a93d-064aa50785d4:b2d0528f-def0-4fde-8b6e-d4804e1e00bc", // Replace with your BrowseAI API Key
                updateInterval: 24 * 60 * 60 * 1000 // Fetch new devotional daily
            }
        }
    ]
};
