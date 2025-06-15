"use client";
import { useGetProfileQuery } from "@/store/api/appApi";

const Dashboard = () => {
  const { data, error, isLoading } = useGetProfileQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Hello, {data.name}</h1>
    </div>
  );
};

export default Dashboard;
