/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useStore } from './store';

// Pages
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import DashboardRouter from './pages/Dashboard/DashboardRouter';
import ManageLots from './pages/Lots/ManageLots';
import Login from './pages/Login';
import Register from './pages/Register';
import Negotiations from './pages/Negotiations';
import Contracts from './pages/Contracts';
import QualityReports from './pages/QualityReports';
import { Messages, Logistics, Disputes, Transactions, Profile } from './pages/Placeholders';

export default function App() {
  const initBackend = useStore((state) => state.initBackend);

  useEffect(() => {
    initBackend();
  }, [initBackend]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="dashboard" element={<DashboardRouter />} />
          <Route path="lots" element={<ManageLots />} />
          <Route path="negotiations" element={<Negotiations />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="quality" element={<QualityReports />} />
          <Route path="messages" element={<Messages />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<div>Admin</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
