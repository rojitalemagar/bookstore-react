import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Logout = () => {
  const handleLogout = () => {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
  };

  return (
      <button onClick={handleLogout} className="bg-red-500 text-white p-2">Logout</button>
  );
};

export default Logout;