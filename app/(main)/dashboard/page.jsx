import React from 'react'

const page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard. Here is your data:</p>
      <ul className="list-disc pl-6">
        <li>Notifications</li>
        <li>Recent Transactions</li>
        <li>Account Info</li>
      </ul>
    </div>
  );
};

export default page