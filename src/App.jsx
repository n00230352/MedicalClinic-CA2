import { useEffect, useState } from "react";
import { AuthProvider } from "./hooks/useAuth";

import { BrowserRouter as Router, Routes, Route } from "react-router";

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

import Home from '@/pages/Home';

//doctors pages
import DoctorsIndex from '@/pages/doctors/Index';
import DoctorsShow from '@/pages/doctors/Show';
import DoctorsCreate from '@/pages/doctors/Create';
import DoctorsEdit from '@/pages/doctors/Edit';

//patients pages
import PatientsIndex from '@/pages/patients/Index';
import PatientsShow from '@/pages/patients/Show';
import PatientsCreate from '@/pages/patients/Create';
import PatientsEdit from '@/pages/patients/Edit';

//appointments pages
import AppointmentsIndex from '@/pages/appointments/Index';
import AppointmentsShow from '@/pages/appointments/Show';
import AppointmentsCreate from '@/pages/appointments/Create';
import AppointmentsEdit from '@/pages/appointments/Edit';

//diagnoses pages
import DiagnosesIndex from '@/pages/diagnoses/Index';
import DiagnosesShow from '@/pages/diagnoses/Show';
import DiagnosesCreate from '@/pages/diagnoses/Create';
import DiagnosesEdit from '@/pages/diagnoses/Edit';

export default function App() {

  return (
    <Router>
      <AuthProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {/* <Navbar onLogin={onLogin} loggedIn={loggedIn} /> */}

          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full px-6">
                {/* Main content */}
                <Routes>
                  <Route
                    path="/"
                    element={<Home />}
                  />
                  {/* doctors routes */}
                  <Route path="/doctors" element={<DoctorsIndex />} />
                  <Route path="/doctors/create" element={<DoctorsCreate />} />
                  <Route
                    path="/doctors/:id"
                    element={<DoctorsShow />}
                  />
                  <Route
                    path="/doctors/:id/edit"
                    element={<DoctorsEdit />}
                  />

                  {/* patients routes */}
                  <Route path="/patients" element={<PatientsIndex />} />
                  <Route path="/patients/create" element={<PatientsCreate />} />
                  <Route
                    path="/patients/:id"
                    element={<PatientsShow />}
                  />
                  <Route
                    path="/patients/:id/edit"
                    element={<PatientsEdit />}
                  />

                  {/* appointments routes */}
                  <Route path="/appointments" element={<AppointmentsIndex />} />
                  <Route path="/appointments/create" element={<AppointmentsCreate />} />
                  <Route
                    path="/appointments/:id"
                    element={<AppointmentsShow />}
                  />
                  <Route
                    path="/appointments/:id/edit"
                    element={<AppointmentsEdit />}
                  />

                   {/* diagnoses routes */}
                  <Route path="/diagnoses" element={<DiagnosesIndex />} />
                  <Route path="/diagnoses/create" element={<DiagnosesCreate />} />
                  <Route
                    path="/diagnoses/:id"
                    element={<DiagnosesShow />}
                  />
                  <Route
                    path="/diagnoses/:id/edit"
                    element={<DiagnosesEdit />}
                  />
                </Routes>
                
                
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}