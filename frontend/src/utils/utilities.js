import { auth } from "../firebase-config";
import axios from "axios";

export const fetchResources = async (videoId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("user not found");
    }

    if (videoId) {
        const response = await axios.get(
            `http://localhost:5000/get-resources?videoId=${videoId}`
        )

        console.log(response.data)
        return response.data
    }
  } catch (err) {
    console.error("error fetching playlist: ", err);
  }
};
