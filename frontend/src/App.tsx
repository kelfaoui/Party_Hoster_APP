import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Salles from './pages/Salles';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Carte from './pages/Carte';
import SalleDetail from './pages/SalleDetail';
import Utilisateurs from './pages/Admin/Utilisateurs';
import UserDetail from './pages/Admin/UserDetail';
import EditUser from './pages/Admin/EditUser';
import Reservations from './pages/Admin/Reservations';
import Dashboard from './pages/Admin/Dashboard';
import AdminSalles from './pages/Admin/Salles';
import EditSalle from './pages/Admin/EditSalle';
import AdminLayout from './components/Admin/AdminLayout';
import OwnerLayout from './components/Owner/OwnerLayout';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import OwnerReservations from './pages/Owner/Reservations';
import OwnerSalles from './pages/Owner/OwnerSalles';
import OwnerEditSalle from './pages/Owner/EditSalle';
import ClientLayout from './components/Client/ClientLayout';
import ClientDashboard from './pages/Client/ClientDashboard';
import ClientReservations from './pages/Client/ClientReservations';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/salles" element={<Salles />} />
      <Route path="/salles/:id" element={<SalleDetail />} /> {/* Détail de la salle */}
      <Route path="/carte" element={<Carte />} /> {/* Le lien de la carte est insréré ici */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* /admin */}
          <Route path="dashboard" element={<Dashboard />} /> {/* /admin/dashboard */}
          <Route path="utilisateurs" element={<Utilisateurs />} /> {/* /admin/utilisateurs */}
          <Route path="utilisateurs/:id" element={<UserDetail />} /> {/* /admin/utilisateurs/:id */}
          <Route path="utilisateurs/modifier/:id" element={<EditUser />} /> {/* /admin/utilisateurs/modifier/:id */}
          <Route path="reservations" element={<Reservations />} /> {/* /admin/reservations */}
          <Route path="salles" element={<AdminSalles />} /> {/* /admin/salles */}
          <Route path="salles/modifier/:id" element={<EditSalle />} /> {/* /admin/salles/modifier/:id */}
      </Route>

      {/* Proprietaire */}
      <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard />} /> {/* /owner */}
          <Route path="dashboard" element={<OwnerDashboard />} /> {/* /owner/dashboard */}
          <Route path="reservations" element={<OwnerReservations />} /> {/* /owner/reservations */}
          <Route path="salles" element={<OwnerSalles />} /> {/* /owner/salles */}
          <Route path="salles/modifier/:id" element={<OwnerEditSalle />} /> {/* /owner/salles/modifier/:id */}
      </Route>

      {/* Client */}
      <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} /> {/* /client */}
          <Route path="dashboard" element={<ClientDashboard />} /> {/* /client/dashboard */}
          <Route path="reservations" element={<ClientReservations />} /> {/* /client/reservations */}
      </Route>
    </Routes>
  );
}

export default App;