const axios = require("axios");

(async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/index-url", {
      url: "https://example.com/test-page"
    });

    console.log("✅ Indexing response:", response.data);
  } catch (err) {
    console.error("❌ Error indexing:", err.response?.data || err.message);
  }
})();
