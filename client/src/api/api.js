import axios from "axios";

const fetchData = async () => {
  const controller = new AbortController();
  try {
    const response = await axios.get("http://localhost:5000/", {
      signal: controller.signal,
    });
    console.log(response.data);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("API Error:", error);
    }
  }
};
