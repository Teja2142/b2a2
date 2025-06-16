import React, { useState, useEffect } from 'react';

const AuctionCard = ({ date, location, time, items, lanes, status }) => (
  <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-between mt-4">
    <div className="flex items-center">
      <div className="bg-blue-800 text-white p-2 rounded-lg mr-4">
        <p className="text-sm font-bold">MAR</p>
        <p className="text-2xl font-bold">{date}</p>
      </div>
      <div>
        <p className="font-semibold">{location}</p>
        <p className="text-sm text-gray-600">{time}</p>
        <p className="text-sm text-gray-600">{items} Items</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm">{lanes[0]}</p>
      <p className="text-sm">{lanes[1]}</p>
      <p className="text-sm text-blue-600">{status[0]}</p>
      <button className="bg-blue-800 text-white px-4 py-2 rounded-lg mt-2">{status[1]}</button>
    </div>
  </div>
);

const Auctions = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define your Django API endpoints
  const apiEndpoints = {
    today: 'http://abdbbda4521ed4d01ae43d095038b45e-1786652182.ap-south-1.elb.amazonaws.com//api/today-auctions/',
    live: 'http://3.111.149.204:8000/api/live-auctions/',
    calendar: 'http://3.111.149.204:8000/api/auction-calendar/',
  };

  // Fetch auctions based on the active tab
  const fetchAuctions = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiEndpoints[tab]);
      if (!response.ok) {
        throw new Error('Failed to fetch auctions');
      }
      const data = await response.json();
      setAuctions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the active tab changes
  useEffect(() => {
    fetchAuctions(activeTab);
  }, [activeTab]);

  // Render auction cards
  const renderAuctions = () => {
    if (loading) {
      return <p className="text-center text-gray-600 mt-4">Loading...</p>;
    }
    if (error) {
      return <p className="text-center text-red-600 mt-4">Error: {error}</p>;
    }
    if (auctions.length === 0) {
      return <p className="text-center text-gray-600 mt-4">No auctions available.</p>;
    }

    return auctions.map((auction, index) => (
      <AuctionCard
        key={index}
        date={auction.date}
        location={auction.location}
        time={auction.time}
        items={auction.items}
        lanes={auction.lanes}
        status={auction.status}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between space-x-4">
        <button
          className={`flex-1 py-2 rounded-lg border-2 ${
            activeTab === 'today' ? 'border-blue-800 text-blue-800' : 'border-gray-300 text-gray-600'
          } font-semibold`}
          onClick={() => setActiveTab('today')}
        >
          TODAY AUCTION
        </button>
        <button
          className={`flex-1 py-2 rounded-lg border-2 ${
            activeTab === 'live' ? 'border-blue-800 text-blue-800' : 'border-gray-300 text-gray-600'
          } font-semibold`}
          onClick={() => setActiveTab('live')}
        >
          LIVE AUCTION
        </button>
        <button
          className={`flex-1 py-2 rounded-lg border-2 ${
            activeTab === 'calendar' ? 'border-blue-800 text-blue-800' : 'border-gray-300 text-gray-600'
          } font-semibold`}
          onClick={() => setActiveTab('calendar')}
        >
          AUCTION SAIL CALENDAR
        </button>
      </div>
      {renderAuctions()}
    </div>
  );
};

export default Auctions;
