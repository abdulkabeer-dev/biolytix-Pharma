import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import SiteLayout from './components/site/SiteLayout'
import Landing from './pages/Landing'
import About from './pages/About'
import Certificates from './pages/Certificates'
import Products from './pages/Products'
import QualityPolicy from './pages/QualityPolicy'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOverview from './pages/admin/AdminOverview'
import AdminProducts from './pages/admin/AdminProducts'
import AdminDivisions from './pages/admin/AdminDivisions'
import AdminHeroSlider from './pages/admin/AdminHeroSlider'
import AdminCompany from './pages/admin/AdminCompany'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminAuthGuard from './pages/admin/AdminAuthGuard'

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Site Routes */}
          <Route element={<SiteLayout />}>
            <Route index element={<Landing />} />
            <Route path="about" element={<About />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="about/certificates" element={<Certificates />} />
            <Route path="products" element={<Products />} />
            <Route path="quality-policy" element={<QualityPolicy />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login */}
          <Route path="admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route
            path="admin"
            element={
              <AdminAuthGuard>
                <AdminLayout />
              </AdminAuthGuard>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="divisions" element={<AdminDivisions />} />
            <Route path="slides" element={<AdminHeroSlider />} />
            <Route path="company" element={<AdminCompany />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}
