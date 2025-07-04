import { auth } from "../firebase-config";
import axios from "axios";

const BASE_URL = `https://ytracker-uohc.onrender.com/api`


export const fetchResources = async (videoId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("user not found");
    }

    if (videoId) {
        const response = await axios.get(
            `${BASE_URL}/get-resources?videoId=${videoId}`
        )

        console.log(response.data)
        return response.data
    }
  } catch (err) {
    console.error("error fetching playlist: ", err);
  }
};
