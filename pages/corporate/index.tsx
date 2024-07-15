// pages/student/studentList.tsx
import React, { useState, useEffect } from 'react';

import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { getUsersByEnterprise } from '../../services/userService';
import { getUsersActivityCount } from '../../services/appSessionService';
import { getEnterprises } from '../../services/enterpriseService';
import { Enterprise } from '../../interfaces/Enterprise';
import './../../app/globals.css';


const CorporatePage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState({
    totalUsers: 0,
    visitorUsers: 0
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      setShowSidebar(JSON.parse(savedState));
    }

    const fetchEnterprises = async () => {
      try {
        const data = await getEnterprises();
        setEnterprises(data);
      } catch (error) {
        console.error('Error fetching enterprises:', error);
      }
    };

    fetchEnterprises();
  }, []);

  useEffect(() => {
    if (selectedEnterprise !== null) {
      const fetchData = async () => {
        try {
          const [usersData, visitorData] = await Promise.all([
            getUsersByEnterprise(selectedEnterprise),
            getUsersActivityCount(startDate, endDate, selectedEnterprise)
          ]);

          setFilteredData({
            totalUsers: usersData.totalUsers,
            visitorUsers: visitorData.length
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Error fetching data');
        }
      };

      fetchData();
    }
  }, [selectedEnterprise, startDate, endDate]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEnterpriseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEnterprise(Number(e.target.value));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEnterprise !== null) {
      const fetchData = async () => {
        try {
          const visitorData = await getUsersActivityCount(startDate, endDate, selectedEnterprise);
          setFilteredData({
            ...filteredData,
            visitorUsers: visitorData.length
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Error fetching data');
        }
      };

      fetchData();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        
      </div>
    </div>
  );
};

export default CorporatePage;
