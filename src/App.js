import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  FileText,
  Users,
  Settings,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  LogOut,
  Building2,
  Copy,
  Calculator,
  Search,
  Eye,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Send,
  MessageCircle,
  RefreshCw,
  Mail,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Download,
  Upload,
  Palette,
  Shield,
  FileBarChart,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  User,
  Home,
  Check,
  XCircle,
  Wrench
} from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './lib/firebase';
import { generateQuotationPDF } from './utils/pdfGenerator';
import { sendViaEmail } from './utils/sendViaEmail';
import { sendViaWhatsAppQuotation } from './utils/sendViaWhatsAppQuotation';
import QuotationsView from './components/QuotationsView';
import QuotationModal from './components/QuotationModal';
import PaymentStatusView from './components/PaymentStatusView';
import PaymentModal from './components/PaymentModal';
import ClientsView from './components/ClientsView';
import ClientModal from './components/ClientModal';
import ServicesView from './components/ServicesView';
import ServiceModal from './components/ServiceModal';
import AuthView from './components/AuthView';
import MobileNav from './components/layout/MobileNav';
import LoadingSpinner from './components/LoadingSpinner';
import CompanySettingsView from './components/CompanySettingsView';
import MaintenanceView from './components/MaintenanceView';
import MaintenanceModal from './components/MaintenanceModal';
import PaymentStatusModal from './components/PaymentStatusModal';
import FichasAdminModal from './components/FichasAdminModal';
import { 
  handleThemeChange, 
  toggleDarkMode, 
  handleLogoUpload, 
  removeLogo, 
  saveCompanySettings, 
  loadSavedSettings, 
  loadUserPreferences,
  saveUserPreferences,
  getThemeClasses 
} from './lib/utils.js';

// Firebase Hooks
import { useQuotations } from './hooks/useQuotations';
import { useClients } from './hooks/useClients';
import { useServices } from './hooks/useServices';
import { useCompany } from './hooks/useCompany';
import { useUserRoles } from './hooks/useUserRoles';

const CotizacionesApp = () => {
  // ESTADOS PRINCIPALES
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [authMode, setAuthMode] = useState('login');

  // FIREBASE HOOKS
  const { quotations } = useQuotations();
  const { clients } = useClients();
  const { services } = useServices();
  const { company } = useCompany();
  const { userRole, userProfile, loading: roleLoading, isAdmin, canEditCompany, canCreateContent, updateUserProfile } = useUserRoles(currentUser?.uid, currentUser?.email);

  // LISTENER DE AUTENTICACIÓN DE FIREBASE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email
        });
        setCurrentView('dashboard');
        
        // Cargar preferencias del usuario autenticado
        await loadUserPreferences(user.uid, setTheme, setDarkMode);
      } else {
        setCurrentUser(null);
        setCurrentView('login');
        // Cargar configuraciones locales cuando no hay usuario
        loadSavedSettings(setTheme, setDarkMode);
      }
    });

    return () => unsubscribe();
  }, []);

  // ESTADOS DE TEMA Y CONFIGURACIÓN
  const [theme, setTheme] = useState('blue');
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);

  // CARGAR CONFIGURACIONES GUARDADAS AL INICIAR
  useEffect(() => {
    loadSavedSettings(setTheme, setDarkMode);
  }, []);

  // GUARDAR PREFERENCIAS DEL USUARIO EN FIREBASE
  useEffect(() => {
    if (currentUser?.uid && !roleLoading) {
      saveUserPreferences(currentUser.uid, theme, darkMode);
    }
  }, [theme, darkMode, currentUser?.uid, roleLoading]);

  // ESTADOS PARA FORMULARIOS DE AUTENTICACIÓN
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [forgotForm, setForgotForm] = useState({ email: '' });

  // ESTADOS PARA NUEVOS ELEMENTOS
  const [newQuotation, setNewQuotation] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'Media',
    notes: '',
    items: [{ id: Date.now(), quantity: 1, service: '', unitPrice: 0, total: 0 }],
    discount: 0
  });

  const [newClient, setNewClient] = useState({
    rut: '',
    encargado: '',
    empresa: '',
    direccion: '',
    ciudad: '',
    region: '',
    telefono: '',
    email: ''
  });

  const [newService, setNewService] = useState({
    name: '',
    price: 0,
    category: 'General',
    active: true
  });

  // ESTADOS PARA EDICIÓN
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompanyLogo, setNewCompanyLogo] = useState(null);

  // ESTADOS PARA MODALES Y UI
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [editingPaymentStatus, setEditingPaymentStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFichasModal, setShowFichasModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // FUNCIONES DE BÚSQUEDA CON USECALLBACK PARA EVITAR PÉRDIDA DE FOCO
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // ESTADOS PARA NOTIFICACIONES
  const [notifications, setNotifications] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // ESTADOS PARA FILTROS
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    priority: '',
    minAmount: '',
    maxAmount: '',
    client: '',
    createdBy: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // ESTADOS PARA REPORTES
  const [reportType, setReportType] = useState('monthly');
  const [reportPeriod, setReportPeriod] = useState('2025-01');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // TEMAS DISPONIBLES
  const themes = {
    blue: { primary: 'blue-600', secondary: 'blue-100', accent: 'blue-400' },
    green: { primary: 'green-600', secondary: 'green-100', accent: 'green-400' },
    purple: { primary: 'purple-600', secondary: 'purple-100', accent: 'purple-400' },
    red: { primary: 'red-600', secondary: 'red-100', accent: 'red-400' },
    gray: { primary: 'gray-600', secondary: 'gray-100', accent: 'gray-400' }
  };

  // FUNCIONES AUXILIARES Y UTILITARIOS
  const formatRut = (value) => {
    const cleanRut = value.replace(/[^\dkK]/g, '');
    if (cleanRut.length <= 1) return cleanRut;
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedBody}-${dv}`;
  };

const validateRut = (rut) => {
  const cleanRut = rut.replace(/[^\dkK]/g, '');
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toLowerCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  let calculatedDv;

  if (remainder === 11) {
    calculatedDv = '0';
  } else if (remainder === 10) {
    calculatedDv = 'k';
  } else {
    calculatedDv = remainder.toString();
  }

  return calculatedDv === dv;
};

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

const showNotification = (message, type = 'success') => {
  const id = Date.now();
  const notification = { id, message, type, theme: theme }; // Agrega el tema actual
  setNotifications(prev => [...prev, notification]);
  setTimeout(() => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, 4000);
};

  const calculateQuotationTotals = (items, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountAmount = subtotal * (discount / 100);
    const subtotalWithDiscount = subtotal - discountAmount;
    const iva = subtotalWithDiscount * 0.19;
    const total = subtotalWithDiscount + iva;
    return { subtotal, discountAmount, subtotalWithDiscount, iva, total };
  };

  const calculateValidUntilDate = (fromDate) => {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const formatCurrency = (amount, currency = 'CLP') => {
    if (typeof amount !== 'number') return '$0';
    const formatOptions = {
      style: 'currency',
      currency: currency === 'CLP' ? 'CLP' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    };

    try {
      return new Intl.NumberFormat('es-CL', formatOptions).format(amount);
    } catch (error) {
      return `$${amount.toLocaleString()}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CL');
    } catch (error) {
      return dateString;
    }
  };

  // FUNCIONES DE FILTRADO (SIMPLIFICADAS PARA COMPATIBILIDAD)
  const getFilteredClients = useCallback(() => {
    return []; // Los componentes ahora manejan sus propios datos desde Firebase
  }, []);

  const getFilteredServices = useCallback(() => {
    return []; // Los componentes ahora manejan sus propios datos desde Firebase
  }, []);

  const getFilteredQuotations = useCallback(() => {
    return []; // Los componentes ahora manejan sus propios datos desde Firebase
  }, []);

  // FUNCIONES DE VALIDACIÓN
  const validateQuotationForm = (quotationData) => {
    const errors = [];
    if (!quotationData.client) {
      errors.push('Por favor selecciona un cliente');
    }
    if (!quotationData.items || quotationData.items.length === 0) {
      errors.push('Por favor agrega al menos un servicio');
    } else {
      const hasValidItems = quotationData.items.some(item => item.service && item.quantity > 0);
      if (!hasValidItems) {
        errors.push('Por favor agrega al menos un servicio válido');
      }
    }
    if (quotationData.discount < 0 || quotationData.discount > 100) {
      errors.push('El descuento debe estar entre 0% y 100%');
    }
    return errors;
  };

  const validateClientForm = (clientData, isEditing = false, existingClients = []) => {
    const errors = [];
    if (!clientData.rut || !clientData.empresa) {
      errors.push('RUT y Empresa son campos obligatorios');
    }
    if (clientData.rut && !validateRut(clientData.rut)) {
      errors.push('RUT inválido');
    }
    if (clientData.email && !validateEmail(clientData.email)) {
      errors.push('Email inválido');
    }
    if (clientData.rut) {
      const duplicateClient = existingClients.find(c =>
        c.rut === clientData.rut && (!isEditing || c.id !== clientData.id)
      );
      if (duplicateClient) {
        errors.push('Ya existe un cliente con este RUT');
      }
    }
    return errors;
  };

  const validateServiceForm = (serviceData, isEditing = false, existingServices = []) => {
    const errors = [];
    if (!serviceData.name || serviceData.price <= 0) {
      errors.push('Nombre y precio válido son campos obligatorios');
    }
    if (serviceData.price < 0) {
      errors.push('El precio no puede ser negativo');
    }
    if (serviceData.name) {
      const duplicateService = existingServices.find(s =>
        s.name.toLowerCase() === serviceData.name.toLowerCase() &&
        (!isEditing || s.id !== serviceData.id)
      );
      if (duplicateService) {
        errors.push('Ya existe un servicio con este nombre');
      }
    }
    return errors;
  };

  // FUNCIONES DE GESTIÓN DE ESTADOS
  const startEdit = (type, item) => {
    switch (type) {
      case 'quotation':
        setEditingQuotation({ ...item });
        setModalType('quotation');
        break;
      case 'client':
        setEditingClient({ ...item });
        setModalType('client');
        break;
      case 'service':
        setEditingService({ ...item });
        setModalType('service');
        break;
      case 'company':
        setEditingCompany({ ...item });
        setModalType('company');
        break;
      default:
        return;
    }
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditingQuotation(null);
    setEditingClient(null);
    setEditingService(null);
    setEditingCompany(null);
    setShowModal(false);
    setModalType('');

    setNewQuotation({
      client: '',
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'Media',
      notes: '',
      items: [{ id: Date.now(), quantity: 1, service: '', unitPrice: 0, total: 0 }],
      discount: 0
    });

    setNewClient({
      rut: '',
      encargado: '',
      empresa: '',
      direccion: '',
      ciudad: '',
      region: '',
      telefono: '',
      email: ''
    });

    setNewService({
      name: '',
      price: 0,
      category: 'General',
      active: true
    });
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      priority: '',
      minAmount: '',
      maxAmount: '',
      client: '',
      createdBy: ''
    });
    setSearchTerm('');
    showNotification('Filtros limpiados', 'info');
  };

  // FUNCIONES DE GESTIÓN DE ESTADOS (Las funciones CRUD ahora están en los hooks de Firebase)
  
  // FUNCIONES DE GESTIÓN DE ITEMS DE COTIZACIÓN
  const addQuotationItem = () => {
    const newItem = {
      id: Date.now(),
      quantity: 1,
      service: '',
      unitPrice: 0,
      total: 0
    };

    if (editingQuotation) {
      setEditingQuotation(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem]
      }));
    } else {
      setNewQuotation(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem]
      }));
    }
  };

  const updateQuotationItem = (index, field, value) => {
    const updateFunction = (prev) => {
      const items = [...(prev.items || [])];
      if (!items[index]) return prev;

      items[index] = { ...items[index], [field]: value };

      if (field === 'service' && services) {
        const service = services.find(s => s.name === value);
        items[index].unitPrice = service ? service.price : 0;
      }

      items[index].total = (items[index].quantity || 0) * (items[index].unitPrice || 0);

      return { ...prev, items };
    };

    if (editingQuotation) {
      setEditingQuotation(updateFunction);
    } else {
      setNewQuotation(updateFunction);
    }
  };

  const removeQuotationItem = (index) => {
    if (editingQuotation) {
      setEditingQuotation(prev => ({
        ...prev,
        items: (prev.items || []).filter((_, i) => i !== index)
      }));
    } else {
      setNewQuotation(prev => ({
        ...prev,
        items: (prev.items || []).filter((_, i) => i !== index)
      }));
    }
  };

  // FUNCIONES PARA MANEJAR CAMPOS DE MODALES
  const handleQuotationFieldChange = useCallback((field, value) => {
    if (editingQuotation) {
      setEditingQuotation(prev => ({ ...prev, [field]: value }));
    } else {
      setNewQuotation(prev => ({ ...prev, [field]: value }));
    }
  }, [editingQuotation]);

  const handleClientFieldChange = useCallback((field, value) => {
    if (editingClient) {
      setEditingClient(prev => ({ ...prev, [field]: value }));
    } else {
      setNewClient(prev => ({ ...prev, [field]: value }));
    }
  }, [editingClient]);

  const handleServiceFieldChange = useCallback((field, value) => {
    if (editingService) {
      setEditingService(prev => ({ ...prev, [field]: value }));
    } else {
      setNewService(prev => ({ ...prev, [field]: value }));
    }
  }, [editingService]);

  // FUNCIONES DE AUTENTICACIÓN
  const handleLogin = async () => {
    try {
      // Usar Firebase Auth real con email y password
      const result = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      
      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || result.user.email
      });
      setCurrentView('dashboard');
      showNotification('Inicio de sesión exitoso', 'success');
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión';
          break;
        default:
          errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentView('login');
      showNotification('Sesión cerrada exitosamente', 'success');
    } catch (error) {
      showNotification('Error al cerrar sesión', 'error');
    }
  };

  const handleRegister = async () => {
    try {
      if (registerForm.password !== registerForm.confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
      }
      
      if (registerForm.password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
      
      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: registerForm.name || result.user.email
      });
      
      setCurrentView('dashboard');
      showNotification('Cuenta creada exitosamente', 'success');
      
      // Limpiar formulario
      setRegisterForm({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      });
    } catch (error) {
      let errorMessage = 'Error al crear la cuenta';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email ya está registrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión';
          break;
        default:
          errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!forgotForm.email) {
        showNotification('Por favor ingresa tu email', 'error');
        return;
      }

      await sendPasswordResetEmail(auth, forgotForm.email);
      showNotification('Email de recuperación enviado. Revisa tu bandeja de entrada.', 'success');
      
      // Limpiar formulario y volver al login
      setForgotForm({ email: '' });
      setAuthMode('login');
    } catch (error) {
      let errorMessage = 'Error al enviar email de recuperación';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión';
          break;
        default:
          errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    }
  };

  // FUNCIONES DE ESTADÍSTICAS Y UTILIDADES
  const getStatistics = () => {
    if (!quotations || quotations.length === 0) return null;

    const totalQuotations = quotations.length;
    const pendingQuotations = quotations.filter(q => q.status === 'Pendiente').length;
    const invoicedQuotations = quotations.filter(q => q.status === 'Facturada').length;
    const totalRevenue = quotations
      .filter(q => q.status === 'Facturada')
      .reduce((sum, q) => sum + (q.total || 0), 0);
    const averageQuotationValue = totalQuotations > 0
      ? quotations.reduce((sum, q) => sum + (q.total || 0), 0) / totalQuotations
      : 0;

    return {
      totalQuotations,
      pendingQuotations,
      invoicedQuotations,
      totalRevenue,
      averageQuotationValue,
      totalClients: clients?.length || 0,
      activeServices: services?.filter(s => s.active)?.length || 0
    };
  };

  const sendViaWhatsApp = (quotation) => {
    sendViaWhatsAppQuotation(quotation, clients, company, showNotification);
  };

  const exportToPDF = async (quotation) => {
    if (!quotation || !clients || !company) {
      showNotification('Error al preparar la cotización para PDF', 'error');
      return;
    }

    const clientName = quotation.client || quotation.clientName;
    const client = clients.find(c => c.empresa === clientName);

    setIsGeneratingPDF(true);
    try {
      await generateQuotationPDF(quotation, company, client);
      showNotification('PDF generado exitosamente', 'success');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showNotification('Error al generar PDF', 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

// COMPONENTE DE NOTIFICACIONES
const NotificationContainer = () => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {notifications.map(notification => (
      <div
        key={notification.id}
        className={`px-4 py-3 rounded-lg shadow-lg transition-all duration-500 transform ${
          notification.type === 'success' ? (
            notification.theme === 'blue' ? 'bg-blue-500 text-white' :
            notification.theme === 'green' ? 'bg-green-500 text-white' :
            notification.theme === 'purple' ? 'bg-purple-500 text-white' :
            notification.theme === 'red' ? 'bg-red-500 text-white' :
            notification.theme === 'gray' ? 'bg-gray-500 text-white' :
            'bg-green-500 text-white' // fallback
          ) : notification.type === 'error' ? 'bg-red-500 text-white' :
          notification.type === 'info' ? 'bg-blue-500 text-white' :
          notification.type === 'warning' ? 'bg-orange-500 text-white' :
          'bg-gray-500 text-white'
        } ${darkMode ? 'shadow-2xl' : 'shadow-lg'}`}
      >
        <div className="flex items-center space-x-2">
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {notification.type === 'info' && <Info className="w-5 h-5" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      </div>
    ))}
  </div>
);

  // FUNCIONES DE MANEJO DE FORMULARIOS CON USECALLBACK
  const handleEmailChange = useCallback((e) => {
    setLoginForm(prev => ({ ...prev, email: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setLoginForm(prev => ({ ...prev, password: e.target.value }));
  }, []);

  const handleRegisterFieldChange = useCallback((field, value) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleForgotEmailChange = useCallback((e) => {
    setForgotForm(prev => ({ ...prev, email: e.target.value }));
  }, []);

  const handleSwitchAuthMode = useCallback((mode) => {
    setAuthMode(mode);
  }, []);

// COMPONENTE SIDEBAR CON SOPORTE PARA TEMAS Y MODO OSCURO
const Sidebar = () => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  return (
    <div className={`hidden md:flex w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg h-screen flex-col`}>
      {/* HEADER DEL SIDEBAR */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
              <Building2 className={`w-8 h-8 ${theme === 'blue' ? 'text-blue-600' : 
                                               theme === 'green' ? 'text-green-600' :
                                               theme === 'purple' ? 'text-purple-600' :
                                               theme === 'red' ? 'text-red-600' :
                                               'text-gray-600'}`} />
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              CotizApp
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentUser?.displayName}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {roleLoading ? 'Cargando...' : (userRole === 'admin' ? '👑 Administrador' : '👤 Usuario')}
            </p>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {/* Dashboard */}
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard' 
                ? `${currentTheme.secondary} ${currentTheme.text}` 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          {/* Cotizaciones */}
          <button
            onClick={() => setCurrentView('quotations')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'quotations' 
                ? `${currentTheme.secondary} ${currentTheme.text}` 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Cotizaciones</span>
          </button>

          {/* Estado de Pago */}
          <button
            onClick={() => setCurrentView('paymentStatus')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'paymentStatus' 
                ? `${currentTheme.secondary} ${currentTheme.text}` 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Estado de Pago</span>
          </button>

          {/* Clientes */}
          <button
            onClick={() => setCurrentView('clients')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'clients' 
                ? `${currentTheme.secondary} ${currentTheme.text}` 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Clientes</span>
          </button>

          {/* Servicios */}
          <button
            onClick={() => setCurrentView('services')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'services' 
                ? `${currentTheme.secondary} ${currentTheme.text}` 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Servicios</span>
          </button>

          {/* Mantenimiento */}
          <button
            onClick={() => setCurrentView('maintenance')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'maintenance' 
                ? `${currentTheme.secondary} ${currentTheme.text}` 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span>Mantenimiento</span>
          </button>

          {/* Empresa */}
          <button
            onClick={() => setCurrentView('company')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'company' 
                ? `${currentTheme.secondary} ${currentTheme.text}` 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Empresa</span>
          </button>

          {/* Fichas Técnicas - Solo para admins */}
          {isAdmin && (
            <button
              onClick={() => setShowFichasModal(true)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Fichas Técnicas</span>
            </button>
          )}
        </div>
      </nav>

      {/* BOTÓN CERRAR SESIÓN */}
      <div className={`absolute bottom-0 w-64 p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-3 py-2 text-red-600 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-red-900 hover:bg-opacity-20' : 'hover:bg-red-50'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

// COMPONENTE DASHBOARD CON SOPORTE PARA TEMAS Y MODO OSCURO
const DashboardView = () => {
  const stats = getStatistics();
  const currentTheme = getThemeClasses(theme, darkMode);
  
  return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER DEL DASHBOARD */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          Resumen general de tu negocio
        </p>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Cotizaciones */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Cotizaciones
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalQuotations}
                </p>
              </div>
              <FileText className={`w-12 h-12 opacity-20 ${
                theme === 'blue' ? 'text-blue-600' :
                theme === 'green' ? 'text-green-600' :
                theme === 'purple' ? 'text-purple-600' :
                theme === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
            </div>
          </div>

          {/* Pendientes */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingQuotations}
                </p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          {/* Facturadas */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Facturadas
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.invoicedQuotations}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          {/* Ingresos Totales */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ingresos Totales
                </p>
                <p className={`text-3xl font-bold ${
                  theme === 'blue' ? 'text-blue-600' :
                  theme === 'green' ? 'text-green-600' :
                  theme === 'purple' ? 'text-purple-600' :
                  theme === 'red' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  ${Math.round(stats.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className={`w-12 h-12 opacity-20 ${
                theme === 'blue' ? 'text-blue-600' :
                theme === 'green' ? 'text-green-600' :
                theme === 'purple' ? 'text-purple-600' :
                theme === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN INFERIOR: COTIZACIONES RECIENTES Y ACCIONES RÁPIDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cotizaciones Recientes */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Cotizaciones Recientes
          </h3>
          <div className="space-y-3">
            {quotations && quotations
              .sort((a, b) => {
                // Extraer los últimos 3 dígitos del formato COT-2025-005
                const extractNumber = (quotationNumber) => {
                  if (!quotationNumber) return 0;
                  const match = quotationNumber.match(/(\d{3})$/); // Busca los últimos 3 dígitos
                  return match ? parseInt(match[1]) : 0;
                };
                
                const numberA = extractNumber(a.number);
                const numberB = extractNumber(b.number);
                return numberB - numberA; // Orden descendente (más recientes primero)
              })
              .slice(0, 5)
              .map(quotation => (
              <div key={quotation.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {quotation.number}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {quotation.client || quotation.clientName}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${(quotation.total || 0).toLocaleString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    quotation.status === 'Pendiente' ? 'bg-orange-100 text-orange-800' :
                    quotation.status === 'Facturada' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quotation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
                       {/* Nueva Cotización */}
            <button
              onClick={() => {
                setModalType('quotation');
                setShowModal(true);
              }}
              className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                theme === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                theme === 'green' ? 'bg-green-50 hover:bg-green-100' :
                theme === 'purple' ? 'bg-purple-50 hover:bg-purple-100' :
                theme === 'red' ? 'bg-red-50 hover:bg-red-100' :
                'bg-gray-50 hover:bg-gray-100'
              } ${darkMode ? 'hover:bg-opacity-10 bg-opacity-10' : ''}`}
            >
              <Plus className={`w-5 h-5 ${
                theme === 'blue' ? 'text-blue-600' :
                theme === 'green' ? 'text-green-600' :
                theme === 'purple' ? 'text-purple-600' :
                theme === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
              <span className={`font-medium ${
                darkMode ? 'text-white' : 
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              }`}>
                Nueva Cotización
              </span>
            </button>

            {/* Nuevo Cliente */}
            <button
              onClick={() => {
                setModalType('client');
                setShowModal(true);
              }}
               className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                theme === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                theme === 'green' ? 'bg-green-50 hover:bg-green-100' :
                theme === 'purple' ? 'bg-purple-50 hover:bg-purple-100' :
                theme === 'red' ? 'bg-red-50 hover:bg-red-100' :
                'bg-gray-50 hover:bg-gray-100'
              } ${darkMode ? 'hover:bg-opacity-10 bg-opacity-10' : ''}`}
            >
              <Plus className={`w-5 h-5 ${
                theme === 'blue' ? 'text-blue-600' :
                theme === 'green' ? 'text-green-600' :
                theme === 'purple' ? 'text-purple-600' :
                theme === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
              <span className={`font-medium ${
                darkMode ? 'text-white' : 
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              }`}>
                Nuevo Cliente
              </span>
            </button>

            {/* Nuevo Servicio */}
            <button
              onClick={() => {
                setModalType('service');
                setShowModal(true);
              }}
               className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                theme === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                theme === 'green' ? 'bg-green-50 hover:bg-green-100' :
                theme === 'purple' ? 'bg-purple-50 hover:bg-purple-100' :
                theme === 'red' ? 'bg-red-50 hover:bg-red-100' :
                'bg-gray-50 hover:bg-gray-100'
              } ${darkMode ? 'hover:bg-opacity-10 bg-opacity-10' : ''}`}
            >
              <Plus className={`w-5 h-5 ${
                theme === 'blue' ? 'text-blue-600' :
                theme === 'green' ? 'text-green-600' :
                theme === 'purple' ? 'text-purple-600' :
                theme === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
              <span className={`font-medium ${
                darkMode ? 'text-white' : 
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              }`}>
                Nuevo Servicio
              </span>
            </button>

            {/* Nuevo Estado de Pago */}
            <button
              onClick={() => setShowPaymentStatusModal(true)}
               className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                theme === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                theme === 'green' ? 'bg-green-50 hover:bg-green-100' :
                theme === 'purple' ? 'bg-purple-50 hover:bg-purple-100' :
                theme === 'red' ? 'bg-red-50 hover:bg-red-100' :
                'bg-gray-50 hover:bg-gray-100'
              } ${darkMode ? 'hover:bg-opacity-10 bg-opacity-10' : ''}`}
            >
              <Plus className={`w-5 h-5 ${
                theme === 'blue' ? 'text-blue-600' :
                theme === 'green' ? 'text-green-600' :
                theme === 'purple' ? 'text-purple-600' :
                theme === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
              <span className={`font-medium ${
                darkMode ? 'text-white' : 
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              }`}>
                Nuevo Estado de Pago
              </span>
            </button>

            {/* Cobranza */}
            <button
              onClick={() => setShowPaymentModal(true)}
               className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                theme === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
                theme === 'green' ? 'bg-green-50 hover:bg-green-100' :
                theme === 'purple' ? 'bg-purple-50 hover:bg-purple-100' :
                theme === 'red' ? 'bg-red-50 hover:bg-red-100' :
                'bg-gray-50 hover:bg-gray-100'
              } ${darkMode ? 'hover:bg-opacity-10 bg-opacity-10' : ''}`}
            >
              <DollarSign className={`w-5 h-5 ${
                theme === 'blue' ? 'text-blue-600' :
                theme === 'green' ? 'text-green-600' :
                theme === 'purple' ? 'text-purple-600' :
                theme === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
              <span className={`font-medium ${
                darkMode ? 'text-white' : 
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              }`}>
                Cobranza
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// RENDER PRINCIPAL
return (
  <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
    {/* Spinner de carga para generación de PDFs */}
    {isGeneratingPDF && <LoadingSpinner message="Generando cotización PDF..." />}
    
    {!currentUser ? (
      <AuthView
        authMode={authMode}
        loginForm={loginForm}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onLogin={handleLogin}
        registerForm={registerForm}
        onRegisterFieldChange={handleRegisterFieldChange}
        onRegister={handleRegister}
        forgotForm={forgotForm}
        onForgotEmailChange={handleForgotEmailChange}
        onForgotPassword={handleForgotPassword}
        onSwitchMode={handleSwitchAuthMode}
        theme={theme}
        darkMode={darkMode}
      />
    ) : (
      <>
        <div className="flex pb-16 md:pb-0">
          <Sidebar />
          <div className="flex-1">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'quotations' && (
              <QuotationsView
                startEdit={startEdit}
                sendViaWhatsApp={sendViaWhatsApp}
                exportToPDF={exportToPDF}
                setModalType={setModalType}
                setShowModal={setShowModal}
                theme={theme}
                darkMode={darkMode}
                currentUser={currentUser}
                userProfile={userProfile}
              />
            )}
            {currentView === 'paymentStatus' && (
              <PaymentStatusView
                startEdit={startEdit}
                setShowPaymentStatusModal={setShowPaymentStatusModal}
                setEditingPaymentStatus={setEditingPaymentStatus}
                theme={theme}
                darkMode={darkMode}
                currentUser={currentUser}
                userProfile={userProfile}
              />
            )}
            {currentView === 'clients' && (
              <ClientsView
                setModalType={setModalType}
                setShowModal={setShowModal}
                theme={theme}
                darkMode={darkMode}
                startEdit={startEdit}
                userRole={userRole}
                isAdmin={isAdmin}
              />
            )}
            {currentView === 'services' && (
              <ServicesView
                startEdit={startEdit}
                setModalType={setModalType}
                setShowModal={setShowModal}
                theme={theme}
                darkMode={darkMode}
              />
            )}
            {currentView === 'company' && !roleLoading && (
              <CompanySettingsView 
                theme={theme}
                darkMode={darkMode}
                setTheme={setTheme}
                setDarkMode={setDarkMode}
                currentUser={currentUser}
                userRole={userRole}
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
                canEditCompany={canEditCompany}
              />
            )}
            {currentView === 'company' && roleLoading && (
              <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-center py-20">
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Verificando permisos de usuario...
                  </p>
                </div>
              </div>
            )}

            {/* Vista de Mantenimiento */}
            {currentView === 'maintenance' && (
              <MaintenanceView
                setModalType={setModalType}
                setShowModal={setShowModal}
                setSelectedEquipment={setSelectedEquipment}
                theme={theme}
                darkMode={darkMode}
                currentUser={currentUser}
                userProfile={userProfile}
              />
            )}
          </div>
        </div>
        <MobileNav 
          currentView={currentView}
          setCurrentView={setCurrentView}
          theme={theme}
          darkMode={darkMode}
          handleLogout={handleLogout}
          userProfile={userProfile}
          userRole={userRole}
        />
      </>
    )}

      {/* MODALES */}
      {showModal && modalType === 'quotation' && (
        <QuotationModal
          isEditing={editingQuotation !== null}
          quotationData={editingQuotation || null}
          onCancel={cancelEdit}
          theme={theme}
          darkMode={darkMode}
          currentUser={currentUser}
          userProfile={userProfile}
        />
      )}
      {showModal && modalType === 'client' && (
        <ClientModal
          isEditing={editingClient !== null}
          clientData={editingClient || null}
          onCancel={cancelEdit}
          formatRut={formatRut}
          validateRut={validateRut}
          validateEmail={validateEmail}
          theme={theme}
          darkMode={darkMode}
        />
      )}
      {showModal && modalType === 'service' && (
        <ServiceModal
          isEditing={editingService !== null}
          serviceData={editingService || null}
          onCancel={cancelEdit}
          theme={theme}
          darkMode={darkMode}
        />
      )}

      {/* Modal de Mantenimiento */}
      {showModal && (modalType === 'maintenance' || modalType === 'maintenance-record') && (
        <MaintenanceModal
          showModal={showModal}
          setShowModal={setShowModal}
          modalType={modalType}
          theme={theme}
          darkMode={darkMode}
          selectedEquipment={selectedEquipment}
          currentUser={currentUser}
          userProfile={userProfile}
        />
      )}

      {/* Modal de Estado de Pago */}
      <PaymentStatusModal
        isOpen={showPaymentStatusModal}
        onClose={() => {
          setShowPaymentStatusModal(false);
          setEditingPaymentStatus(null);
        }}
        editingData={editingPaymentStatus}
        theme={theme}
        darkMode={darkMode}
        currentUser={currentUser}
        userProfile={userProfile}
      />

      {/* Modal de Cobranza/Pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        theme={theme}
        darkMode={darkMode}
      />

      {/* Modal de Administración de Fichas Técnicas */}
      <FichasAdminModal
        isOpen={showFichasModal}
        onClose={() => setShowFichasModal(false)}
        theme={theme}
        darkMode={darkMode}
      />

      {/* SISTEMA DE NOTIFICACIONES */}
      <NotificationContainer />

      
      {/* PANEL DE NOTIFICACIONES DEL SISTEMA */}
      {showNotificationPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
                <button
                  onClick={() => setShowNotificationPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {systemNotifications.length > 0 ? (
                systemNotifications.map(notification => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <Bell className="w-4 h-4 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No hay notificaciones</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CotizacionesApp;