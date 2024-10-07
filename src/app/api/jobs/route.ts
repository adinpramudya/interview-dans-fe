import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth/next"; // Import getServerSession

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}jobs/`; // Ensure trailing slash

// Define the GET method
export async function GET(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions }); // Use getServerSession
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const bearerToken = session?.accessToken;
    if (!bearerToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const url = new URL(req.url);
    const pathname = url.pathname;
    const jobId = pathname.startsWith("/api/jobs/")
      ? pathname.replace("/api/jobs/", "")
      : null;

    if (jobId) {
      const getResponse = await axios.get(`${API_URL}${jobId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (getResponse?.data) {
        return new Response(JSON.stringify(getResponse.data), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return new Response(JSON.stringify({ error: "Data not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } else {
      // Fetch all jobs
      const searchParams = url.searchParams;

      const search = searchParams.get("search") || "";
      const location = searchParams.get("location") || "";
      const fullTime =
        searchParams.get("full_time") === "true" ? "Full Time" : "";
      const page = searchParams.get("page") || "";
      const size = searchParams.get("size") || "";

      // Prepare query to the external API (if applicable)
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (location) queryParams.append("location", location);
      if (fullTime) queryParams.append("type", fullTime);
      if (page) queryParams.append("type", page);
      if (size) queryParams.append("type", size);

      // Fetch all jobs with filters
      const getResponse = await axios.get(
        `${API_URL}?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      return new Response(JSON.stringify(getResponse.data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error(
      "Error fetching jobs:",
      error.response ? error.response.data : error.message
    );
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
