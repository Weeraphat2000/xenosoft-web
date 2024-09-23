import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPosts } from "../api/post/post";
import { ChartData, Post, UserPostCount } from "../type/post";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

export default function Chart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const pie = {
    labels: data.map((d) => d.username),
    datasets: [
      {
        label: "THB",
        data: data.map((d) => d.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",

          "rgba(204,255,64, 0.2)",
          "rgba(64,255,245,0.2)",
          "rgba(64,67,255,0.2)",
          "rgba(201,64,255,0.2)",
          "rgba(255,64,64,0.2)",
          "rgba(83,255,64,0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",

          "#ccff40",
          "#40fff5",
          "#4043ff",
          "#c940ff",
          "#ff4040",
          "#53ff40",
        ],
        borderWidth: 1,
      },
    ],
  };

  const bar = {
    labels: data.map((d) => d.username),
    datasets: [
      {
        label: "THB",
        data: data.map((d) => d.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",

          "rgba(204,255,64, 0.2)",
          "rgba(64,255,245,0.2)",
          "rgba(64,67,255,0.2)",
          "rgba(201,64,255,0.2)",
          "rgba(255,64,64,0.2)",
          "rgba(83,255,64,0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",

          "#ccff40",
          "#40fff5",
          "#4043ff",
          "#c940ff",
          "#ff4040",
          "#53ff40",
        ],
        borderWidth: 1,
      },
    ],
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts("");

      const userPostCount: UserPostCount = data.reduce(
        (acc: UserPostCount, post: Post) => {
          const userId = post.userId;
          const username = post.User.username;
          if (!acc[userId]) {
            acc[userId] = { username, count: 0 };
          }
          acc[userId].count += 1;
          return acc;
        },
        {}
      );

      setData(Object.values(userPostCount).sort((a, b) => b.count - a.count));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen py-10 w-[800px] mx-auto">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen py-10 w-[800px] mx-auto">
          {data.length !== 0 ? (
            <>
              <h1 className="text-2xl font-bold">Chart</h1>

              <Pie
                data={pie}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: "right",
                    },
                  },
                }}
              />

              <Bar
                data={bar}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top" as const,
                      display: false,
                    },
                    title: {
                      display: true,
                      text: "Amount of Posts per User",
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Users",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Number of Posts",
                      },
                      beginAtZero: true,
                      min: 0,
                      max: data.length > 0 ? data[0].count + 2 : 2,
                    },
                  },
                }}
              />
            </>
          ) : (
            <h1 className="text-2xl font-bold">No Data</h1>
          )}
        </div>
      )}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "blue",
          color: "white",
          padding: 10,
          borderRadius: 10,
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        To Home
      </div>
    </div>
  );
}
