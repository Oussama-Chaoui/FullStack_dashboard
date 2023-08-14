import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import AdminOverview from "scenes/admin/overview";
import { useGetUserQuery } from "state/api";
import Tickets from "scenes/admin/tickets";
import Ticket from "scenes/admin/tickets/Ticket";
import InactiveAdmin from "scenes/admin/inactive";
import Performance from "scenes/performance";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const userId = useSelector((state) => state.global.userId);
  const user = useGetUserQuery(userId);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              {user.data !== undefined && user.data.role !== "user" ? (
                <Route
                  path="/admin/overview"
                  element={<AdminOverview user={user} />}
                />
              ) : (
                <Route
                  path="/admin/*"
                  element={<Navigate to="/dashboard" replace />}
                />
              )}
              {user.data !== undefined && user.data.role !== "user" ? (
                <Route
                  path="/admin/tickets"
                  element={<Tickets user={user} />}
                />
              ) : (
                <Route
                  path="/admin/*"
                  element={<Navigate to="/dashboard" replace />}
                />
              )}

              {user.data !== undefined && user.data.role !== "user" ? (
                <Route
                  path="/admin/tickets/:id"
                  element={<Ticket user={user} />}
                />
              ) : (
                <Route
                  path="/admin/*"
                  element={<Navigate to="/dashboard" replace />}
                />
              )}

              {user.data !== undefined && user.data.role !== "user" ? (
                <Route
                  path="/admin/inactive"
                  element={<InactiveAdmin user={user} />}
                />
              ) : (
                <Route
                  path="/admin/*"
                  element={<Navigate to="/dashboard" replace />}
                />
              )}

              {user.data !== undefined && user.data.role !== "user" ? (
                <Route path="/performance" element={<Performance />} />
              ) : (
                <Route
                  path="/performance/*"
                  element={<Navigate to="/dashboard" replace />}
                />
              )}
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
