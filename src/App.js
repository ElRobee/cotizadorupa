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
  XCircle
} from 'lucide-react';
import { generateQuotationPDF } from './utils/pdfGenerator';
import { sendViaEmail } from './utils/sendViaEmail';
import QuotationsView from './components/QuotationsView';
import QuotationModal from './components/QuotationModal';
import ClientsView from './components/ClientsView';
import ClientModal from './components/ClientModal';
import ServicesView from './components/ServicesView';
import ServiceModal from './components/ServiceModal';
import AuthView from './components/AuthView';
import MobileNav from './components/layout/MobileNav';
import CompanySettingsView from './components/CompanySettingsView';
import { 
  handleThemeChange, 
  toggleDarkMode, 
  handleLogoUpload, 
  removeLogo, 
  saveCompanySettings, 
  loadSavedSettings, 
  getThemeClasses 
} from './lib/utils.js';

// SIMULACIÓN DE FIREBASE AUTH
const mockFirebaseAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email, password) => {
    const validUsers = [
      { uid: '1', email: 'admin@empresa.com', displayName: 'Administrador', role: 'admin' },
      { uid: '2', email: 'usuario@empresa.com', displayName: 'Usuario Regular', role: 'user' },
      { uid: '3', email: 'vendedor@empresa.com', displayName: 'Vendedor', role: 'seller' }
    ];

    const user = validUsers.find(u => u.email === email);
    if (user && password === '123456') {
      return { user };
    }
    throw new Error('Credenciales incorrectas');
  },
  createUserWithEmailAndPassword: async (email, password) => {
    return {
      user: {
        uid: Date.now().toString(),
        email,
        displayName: 'Usuario Nuevo',
        role: 'user'
      }
    };
  },
  signOut: async () => {
    return Promise.resolve();
  },
  sendPasswordResetEmail: async (email) => {
    return Promise.resolve();
  }
};

// DATOS SIMULADOS PARA USUARIOS (AUTH)
const mockFirebaseData = {
  users: [
    { id: 1, email: 'admin@empresa.com', name: 'Administrador', role: 'admin', avatar: null },
    { id: 2, email: 'usuario@empresa.com', name: 'Usuario Regular', role: 'user', avatar: null },
    { id: 3, email: 'vendedor@empresa.com', name: 'Vendedor', role: 'seller', avatar: null }
  ],
  notifications: []
};
  
const CotizacionesApp = () => {
  // ESTADOS PRINCIPALES
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [data, setData] = useState(mockFirebaseData);
  const [authMode, setAuthMode] = useState('login');

  // ESTADOS DE TEMA Y CONFIGURACIÓN
  const [theme, setTheme] = useState('blue');
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);

  // CARGAR CONFIGURACIONES GUARDADAS AL INICIAR
useEffect(() => {
  loadSavedSettings(setTheme, setDarkMode, setData);
}, []);

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
  const [searchTerm, setSearchTerm] = useState('');

  // FUNCIONES DE BÚSQUEDA CON USECALLBACK PARA EVITAR PÉRDIDA DE FOCO
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // ESTADOS PARA NOTIFICACIONES
  const [notifications, setNotifications] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState(mockFirebaseData.notifications);
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
    const iva = subtotal * 0.19;
    const totalBruto = subtotal + iva;
    const discountAmount = totalBruto * (discount / 100);
    const total = totalBruto - discountAmount;
    return { subtotal, iva, totalBruto, discountAmount, total };
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

  // FUNCIONES CRUD
  const deleteItem = (type, id) => {
    const confirmMessages = {
      quotations: '¿Estás seguro de que deseas eliminar esta cotización?',
      clients: '¿Estás seguro de que deseas eliminar este cliente?',
      services: '¿Estás seguro de que deseas eliminar este servicio?'
    };

    const successMessages = {
      quotations: 'Cotización eliminada exitosamente',
      clients: 'Cliente eliminado exitosamente',
      services: 'Servicio eliminado exitosamente'
    };

    if (window.confirm(confirmMessages[type] || '¿Estás seguro de que deseas eliminar este elemento?')) {
      setData(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));

      const message = successMessages[type] || 'Elemento eliminado exitosamente';
      showNotification(message, 'success');
    }
  };

  const saveQuotation = () => {
    const quotationData = editingQuotation || newQuotation;
    const errors = validateQuotationForm(quotationData);
    if (errors.length > 0) {
      showNotification(errors[0], 'error');
      return;
    }

    const totals = calculateQuotationTotals(quotationData.items, quotationData.discount);

    if (editingQuotation) {
      setData(prev => ({
        ...prev,
        quotations: prev.quotations.map(q =>
          q.id === editingQuotation.id
            ? {
                ...quotationData,
                total: totals.total,
                lastModified: new Date().toISOString()
              }
            : q
        )
      }));
      showNotification('Cotización actualizada exitosamente', 'success');
    } else {
      const newId = Math.max(...(data?.quotations?.map(q => q.id) || [0]), 0) + 1;
      const quotationNumber = `COT-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;

      setData(prev => ({
        ...prev,
        quotations: [...prev.quotations, {
          ...quotationData,
          id: newId,
          number: quotationNumber,
          status: 'Pendiente',
          total: totals.total,
          createdBy: currentUser?.email || 'Sistema',
          lastModified: new Date().toISOString()
        }]
      }));
      showNotification('Cotización creada exitosamente', 'success');
    }

    cancelEdit();
  };

  const saveClient = () => {
    const clientData = editingClient || newClient;
    const errors = validateClientForm(clientData, !!editingClient, data?.clients || []);
    if (errors.length > 0) {
      showNotification(errors[0], 'error');
      return;
    }

    if (editingClient) {
      setData(prev => ({
        ...prev,
        clients: prev.clients.map(c =>
          c.id === editingClient.id ? { ...clientData, id: editingClient.id } : c
        )
      }));
      showNotification('Cliente actualizado exitosamente', 'success');
    } else {
      const newId = Math.max(...(data?.clients?.map(c => c.id) || [0]), 0) + 1;
      setData(prev => ({
        ...prev,
        clients: [...prev.clients, {
          ...clientData,
          id: newId,
          createdAt: new Date().toISOString().split('T')[0]
        }]
      }));
      showNotification('Cliente creado exitosamente', 'success');
    }

    cancelEdit();
  };

  const saveService = () => {
    const serviceData = editingService || newService;
    const errors = validateServiceForm(serviceData, !!editingService, data?.services || []);
    if (errors.length > 0) {
      showNotification(errors[0], 'error');
      return;
    }

    if (editingService) {
      setData(prev => ({
        ...prev,
        services: prev.services.map(s =>
          s.id === editingService.id ? {
            ...serviceData,
            id: editingService.id,
            price: Number(serviceData.price)
          } : s
        )
      }));
      showNotification('Servicio actualizado exitosamente', 'success');
    } else {
      const newId = Math.max(...(data?.services?.map(s => s.id) || [0]), 0) + 1;
      setData(prev => ({
        ...prev,
        services: [...prev.services, {
          ...serviceData,
          id: newId,
          price: Number(serviceData.price)
        }]
      }));
      showNotification('Servicio creado exitosamente', 'success');
    }

    cancelEdit();
  };
  
  const duplicateService = (service) => {
  const newId = Math.max(...(data?.services?.map(s => s.id) || [0]), 0) + 1;
  const duplicatedService = {
    ...service,
    id: newId,
    name: `${service.name} (Copia)`,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  setData(prev => ({
    ...prev,
    services: [...prev.services, duplicatedService]
  }));
  showNotification('Servicio duplicado exitosamente', 'success');
};

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

      if (field === 'service' && data?.services) {
        const service = data.services.find(s => s.name === value);
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
      const result = await mockFirebaseAuth.signInWithEmailAndPassword(
        loginForm.email, 
        loginForm.password
      );
      setCurrentUser(result.user);
      setCurrentView('dashboard');
      showNotification('Inicio de sesión exitoso', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await mockFirebaseAuth.signOut();
      setCurrentUser(null);
      setCurrentView('login');
      showNotification('Sesión cerrada exitosamente', 'success');
    } catch (error) {
      showNotification('Error al cerrar sesión', 'error');
    }
  };

  // FUNCIONES DE UTILIDAD ADICIONALES
  const changeQuotationStatus = (quotationId, newStatus) => {
    setData(prev => ({
      ...prev,
      quotations: prev.quotations.map(q =>
        q.id === quotationId ? {
          ...q,
          status: newStatus,
          lastModified: new Date().toISOString()
        } : q
      )
    }));

    const statusMessages = {
      'Pendiente': 'Cotización marcada como Pendiente',
      'Facturada': 'Cotización facturada exitosamente',
      'Rechazada': 'Cotización marcada como Rechazada',
      'Cancelada': 'Cotización cancelada'
    };

    const message = statusMessages[newStatus] || `Estado cambiado a ${newStatus}`;
    showNotification(message, 'success');
  };

  const duplicateQuotation = (quotation) => {
    const newId = Math.max(...(data?.quotations?.map(q => q.id) || [0]), 0) + 1;
    const quotationNumber = `COT-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;

    const duplicatedQuotation = {
      ...quotation,
      id: newId,
      number: quotationNumber,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pendiente',
      createdBy: currentUser?.email || 'Sistema',
      lastModified: new Date().toISOString(),
      items: quotation.items.map(item => ({ ...item, id: Date.now() + Math.random() }))
    };

    setData(prev => ({
      ...prev,
      quotations: [...prev.quotations, duplicatedQuotation]
    }));

    showNotification('Cotización duplicada exitosamente', 'success');
  };

  const getStatistics = () => {
    if (!data?.quotations) return null;

    const totalQuotations = data.quotations.length;
    const pendingQuotations = data.quotations.filter(q => q.status === 'Pendiente').length;
    const invoicedQuotations = data.quotations.filter(q => q.status === 'Facturada').length;
    const totalRevenue = data.quotations
      .filter(q => q.status === 'Facturada')
      .reduce((sum, q) => sum + (q.total || 0), 0);
    const averageQuotationValue = totalQuotations > 0
      ? data.quotations.reduce((sum, q) => sum + (q.total || 0), 0) / totalQuotations
      : 0;

    return {
      totalQuotations,
      pendingQuotations,
      invoicedQuotations,
      totalRevenue,
      averageQuotationValue,
      totalClients: data?.clients?.length || 0,
      activeServices: data?.services?.filter(s => s.active)?.length || 0
    };
  };

  const sendViaWhatsApp = (quotation) => {
    if (!quotation || !data?.clients) {
      showNotification('Error al preparar la cotización para WhatsApp', 'error');
      return;
    }

    const client = data.clients.find(c => c.empresa === quotation.client);
    const totals = calculateQuotationTotals(quotation.items, quotation.discount);

    const message = `
*COTIZACIÓN ${quotation.number}* 📋
▪▪▪▪▪▪▪▪▪▪▪▪▪
📅 *Fecha:* ${quotation.date}
⏰ *Válida hasta:* ${quotation.validUntil}
🏢 *Cliente:* ${quotation.client}
💰 *Total:* $${totals.total.toLocaleString()}
📊 *Estado:* ${quotation.status}
🎯 *Prioridad:* ${quotation.priority}

*🛠️ SERVICIOS:*
${quotation.items.map(item =>
  `• ${item.quantity}x ${item.service}\n  💵 $${item.total.toLocaleString()}`
).join('\n')}

*💳 RESUMEN FINANCIERO:*
• Subtotal: $${totals.subtotal.toLocaleString()}
• IVA (19%): $${totals.iva.toLocaleString()}
${totals.discountAmount > 0 ? `• Descuento: -$${totals.discountAmount.toLocaleString()}` : ''}
• *TOTAL: $${totals.total.toLocaleString()}*

▪▪▪▪▪▪▪▪▪▪▪▪▪
🏢 *${data.company?.razonSocial || 'Mi Empresa'}*
📞 ${data.company?.telefono || 'Sin teléfono'}
📧 ${data.company?.email || 'Sin email'}
📍 ${data.company?.direccion || 'Sin dirección'}

💬 _Contáctanos para más información_
⚡ _Respuesta rápida garantizada_

_"Documento válido sólo como Cotización"_
    `.trim();

    const phoneNumber = client?.telefono?.replace(/[^\d]/g, '') || '';
    const encodedMessage = encodeURIComponent(message);

    let whatsappUrl;
    if (phoneNumber && phoneNumber.length >= 8) {
      const cleanPhone = phoneNumber.startsWith('56') ? phoneNumber : `56${phoneNumber.slice(-8)}`;
      // Intentar primero con el protocolo whatsapp://
      whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    } else {
      whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
    }

    // Intentar abrir la app nativa primero
    try {
      window.location.href = whatsappUrl;
      
      // Si después de un breve momento no se abrió la app, intentar con la versión web
      setTimeout(() => {
        if (document.hidden) {
          // La app se abrió exitosamente
          showNotification('WhatsApp abierto correctamente', 'success');
        } else {
          // Falló la apertura de la app, usar versión web
          const webUrl = phoneNumber && phoneNumber.length >= 8
            ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
            : `https://web.whatsapp.com/send?text=${encodedMessage}`;
          window.open(webUrl, '_blank');
          showNotification('Abriendo WhatsApp Web...', 'info');
        }
      }, 500);
    } catch (error) {
      // Si hay algún error, usar la versión web como respaldo
      const webUrl = phoneNumber && phoneNumber.length >= 8
        ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
        : `https://web.whatsapp.com/send?text=${encodedMessage}`;
      window.open(webUrl, '_blank');
      showNotification('Abriendo WhatsApp Web...', 'info');
    }
  };

  const exportToPDF = async (quotation) => {
    if (!quotation || !data?.clients || !data?.company) {
      showNotification('Error al preparar la cotización para PDF', 'error');
      return;
    }

    const client = data.clients.find(c => c.empresa === quotation.client);

    try {
      await generateQuotationPDF(quotation, data.company, client);
      showNotification('PDF generado exitosamente', 'success');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showNotification('Error al generar PDF', 'error');
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
                  ${stats.totalRevenue.toLocaleString()}
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
            {getFilteredQuotations().slice(0, 5).map(quotation => (
              <div key={quotation.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {quotation.number}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {quotation.client}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${quotation.total.toLocaleString()}
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
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              } ${darkMode ? 'text-opacity-90' : ''}`}>
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
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              } ${darkMode ? 'text-opacity-90' : ''}`}>
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
                theme === 'blue' ? 'text-blue-700' :
                theme === 'green' ? 'text-green-700' :
                theme === 'purple' ? 'text-purple-700' :
                theme === 'red' ? 'text-red-700' :
                'text-gray-700'
              } ${darkMode ? 'text-opacity-90' : ''}`}>
                Nuevo Servicio
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
    {!currentUser ? (
      <AuthView
        authMode={authMode}
        loginForm={loginForm}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onLogin={handleLogin}
        registerForm={registerForm}
        onRegisterFieldChange={handleRegisterFieldChange}
        forgotForm={forgotForm}
        onForgotEmailChange={handleForgotEmailChange}
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
                sendViaEmail={sendViaEmail}
                exportToPDF={exportToPDF}
                setModalType={setModalType}
                setShowModal={setShowModal}
                theme={theme}
                darkMode={darkMode}
              />
            )}
            {currentView === 'clients' && (
              <ClientsView
                setModalType={setModalType}
                setShowModal={setShowModal}
                theme={theme}
                darkMode={darkMode}
                startEdit={startEdit}
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
            {currentView === 'company' && (
              <CompanySettingsView />
            )}
          </div>
        </div>
        <MobileNav 
          currentView={currentView}
          setCurrentView={setCurrentView}
          theme={theme}
          darkMode={darkMode}
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