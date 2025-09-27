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
  Calculator,
  Search,
  Eye,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
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
import QuotationModal from './components/QuotationModal';
import ClientModal from './components/ClientModal';
import ServiceModal from './components/ServiceModal';
import AuthView from './components/AuthView';
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

// DATOS SIMULADOS
const mockFirebaseData = {
  users: [
    { id: 1, email: 'admin@empresa.com', name: 'Administrador', role: 'admin', avatar: null },
    { id: 2, email: 'usuario@empresa.com', name: 'Usuario Regular', role: 'user', avatar: null },
    { id: 3, email: 'vendedor@empresa.com', name: 'Vendedor', role: 'seller', avatar: null }
  ],
  company: {
    razonSocial: 'Mi Empresa de Arriendo',
    rut: '12.345.678-9',
    direccion: 'Av. Principal 123',
    ciudad: 'Viña del Mar',
    region: 'Valparaíso',
    telefono: '+56 32 123 4567',
    email: 'contacto@miempresa.cl',
    logo: null,
    theme: 'blue',
    currency: 'CLP'
  },
  clients: [
    {
      id: 1,
      rut: '77.648.180-7',
      encargado: 'NN',
      empresa: 'Befoods',
      direccion: 'sin informar',
      ciudad: 'Viña del mar',
      region: 'Valparaíso',
      telefono: 'sin informar',
      email: 'sigpre@befoods.cl',
      createdAt: '2025-01-01'
    },
    {
      id: 2,
      rut: '96.870.780-9',
      encargado: 'Ro Gomez',
      empresa: 'Echeverria Izquierdo',
      direccion: 'Santiago',
      ciudad: 'Santiago',
      region: 'Metropolitana de Santiago',
      telefono: '56971345589',
      email: 'rgomez@eimontajes.cl',
      createdAt: '2025-01-02'
    },
    {
      id: 3,
      rut: '77.241.463-3',
      encargado: 'Marco Perez',
      empresa: 'Organismo Tecnico Capacitacion',
      direccion: 'Viña',
      ciudad: 'Viña del mar',
      region: 'Valparaíso',
      telefono: '56934683151',
      email: 'marco.perez@ia-im.com',
      createdAt: '2025-01-03'
    }
  ],
  services: [
    { id: 1, name: 'PLATAFORMAS ELEVADORAS TIJERA', price: 100000, category: 'Elevadores', active: true },
    { id: 2, name: 'BRAZO ARTICULADO 16 MT', price: 100000, category: 'Elevadores', active: true },
    { id: 3, name: 'ELEVADOR ELECTRICO 8 MT', price: 50000, category: 'Elevadores', active: true },
    { id: 4, name: 'ELEVADOR ELECTRICO 10 MT', price: 70000, category: 'Elevadores', active: true },
    { id: 5, name: 'CAMIONES TRANSPORTE', price: 600000, category: 'Transporte', active: true },
    { id: 6, name: 'OPERADOR', price: 45000, category: 'Personal', active: true }
  ],
  quotations: [
    {
      id: 1,
      number: 'COT-2025-001',
      client: 'Befoods',
      date: '2025-01-15',
      total: 145000,
      status: 'Pendiente',
      priority: 'Alta',
      validUntil: '2025-02-15',
      notes: 'Cliente preferencial',
      items: [
        { id: 1, quantity: 2, service: 'ELEVADOR ELECTRICO 8 MT', unitPrice: 50000, total: 100000 },
        { id: 2, quantity: 1, service: 'OPERADOR', unitPrice: 45000, total: 45000 }
      ],
      discount: 0,
      createdBy: 'admin@empresa.com',
      lastModified: '2025-01-15T10:30:00Z'
    },
    {
      id: 2,
      number: 'COT-2025-002',
      client: 'Echeverria Izquierdo',
      date: '2025-01-10',
      total: 690000,
      status: 'Facturada',
      priority: 'Media',
      validUntil: '2025-02-10',
      notes: 'Proyecto a largo plazo',
      items: [
        { id: 1, quantity: 1, service: 'CAMIONES TRANSPORTE', unitPrice: 600000, total: 600000 },
        { id: 2, quantity: 2, service: 'OPERADOR', unitPrice: 45000, total: 90000 }
      ],
      discount: 0,
      createdBy: 'vendedor@empresa.com',
      lastModified: '2025-01-10T14:20:00Z'
    }
  ],
  notifications: [
    {
      id: 1,
      type: 'reminder',
      title: 'Cotización por vencer',
      message: 'La cotización COT-2025-001 vence en 3 días',
      date: new Date().toISOString(),
      read: false,
      priority: 'high'
    }
  ]
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
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const remainder = sum % 11;
    const calculatedDv = remainder < 2 ? remainder.toString() : remainder === 10 ? 'k' : (11 - remainder).toString();
    return calculatedDv === dv;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type };
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

  // FUNCIONES DE FILTRADO
  const getFilteredClients = useCallback(() => {
    if (!data?.clients) return [];
    const searchLower = searchTerm.toLowerCase();
    return data.clients.filter(client => {
      if (!searchTerm) return true;
      return (
        client.empresa.toLowerCase().includes(searchLower) ||
        client.encargado.toLowerCase().includes(searchLower) ||
        client.rut.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm, data?.clients]);

  const getFilteredServices = useCallback(() => {
    if (!data?.services) return [];
    const searchLower = searchTerm.toLowerCase();
    return data.services.filter(service => {
      if (!searchTerm) return true;
      return (
        service.name.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm, data?.services]);

  const getFilteredQuotations = useCallback(() => {
    if (!data?.quotations) return [];
    return data.quotations.filter(quotation => {
      const matchesSearch = !searchTerm ||
        quotation.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.client.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.status || quotation.status === filters.status) &&
        (!filters.priority || quotation.priority === filters.priority) &&
        (!filters.client || quotation.client === filters.client) &&
        (!filters.dateFrom || quotation.date >= filters.dateFrom) &&
        (!filters.dateTo || quotation.date <= filters.dateTo) &&
        (!filters.minAmount || quotation.total >= Number(filters.minAmount)) &&
        (!filters.maxAmount || quotation.total <= Number(filters.maxAmount)) &&
        (!filters.createdBy || quotation.createdBy === filters.createdBy);

      return matchesSearch && matchesFilters;
    });
  }, [searchTerm, filters, data?.quotations]);

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
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            notification.type === 'info' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {notification.type === 'info' && <Info className="w-5 h-5" />}
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
    <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg h-screen`}>
      {/* HEADER DEL SIDEBAR */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
              <Building2 className={`w-8 h-8 ${theme === 'blue' ? 'text-blue-600' : 
                                               theme === 'green' ? 'text-green-600' :
                                               theme === 'purple' ? 'text-purple-600' :
                                               theme === 'red' ? 'text-red-600' :
                                               'text-gray-600'}`} />
          )}
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
              className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Nuevo Cliente</span>
            </button>

            {/* Nuevo Servicio */}
            <button
              onClick={() => {
                setModalType('service');
                setShowModal(true);
              }}
              className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-medium">Nuevo Servicio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

 // COMPONENTE VISTA DE COTIZACIONES CON SOPORTE PARA TEMAS Y MODO OSCURO
const QuotationsView = () => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  // Función para cambiar el estado de la cotización (clicleable)
  const handleStatusClick = (quotation) => {
    const currentStatus = quotation.status;
    let newStatus;
    
    // Ciclo entre estados: Pendiente -> Facturada -> Pendiente
    if (currentStatus === 'Pendiente') {
      newStatus = 'Facturada';
    } else if (currentStatus === 'Facturada') {
      newStatus = 'Pendiente';
    } else {
      // Para otros estados como Rechazada o Cancelada, ir a Pendiente
      newStatus = 'Pendiente';
    }
    
    changeQuotationStatus(quotation.id, newStatus);
  };
  
  return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER DE LA VISTA */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Cotizaciones
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Gestiona tus cotizaciones
          </p>
        </div>
        <button
          onClick={() => {
            setModalType('quotation');
            setShowModal(true);
          }}
          className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cotización</span>
        </button>
      </div>

      {/* TABLA DE COTIZACIONES */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cotizaciones..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Número
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Cliente
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Fecha
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Estado
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Prioridad
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredQuotations().map(quotation => (
                <tr 
                  key={quotation.id} 
                  className={`border-t transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {quotation.number}
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {quotation.client}
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatDate(quotation.date)}
                  </td>
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${quotation.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleStatusClick(quotation)}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 cursor-pointer ${
                        quotation.status === 'Pendiente' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                        quotation.status === 'Facturada' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title={`Click para cambiar estado (Actual: ${quotation.status})`}
                    >
                      {quotation.status}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      quotation.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                      quotation.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quotation.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit('quotation', quotation)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'blue' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          theme === 'green' ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          theme === 'purple' ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          theme === 'red' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' :
                          'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        } ${darkMode ? 'hover:bg-opacity-20' : ''}`}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => sendViaWhatsApp(quotation)}
                        className={`p-1 text-green-600 hover:text-green-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-green-100 hover:bg-opacity-20' : 'hover:bg-green-100'
                        }`}
                        title="Enviar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportToPDF(quotation)}
                        className={`p-1 text-purple-600 hover:text-purple-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-purple-100 hover:bg-opacity-20' : 'hover:bg-purple-100'
                        }`}
                        title="Exportar a PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('quotations', quotation.id)}
                        className={`p-1 text-red-600 hover:text-red-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                        }`}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

 // COMPONENTE VISTA DE CLIENTES CON SOPORTE PARA TEMAS Y MODO OSCURO
const ClientsView = () => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER DE LA VISTA */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Clientes
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Gestiona tu base de clientes
          </p>
        </div>
        <button
          onClick={() => {
            setModalType('client');
            setShowModal(true);
          }}
          className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* TABLA DE CLIENTES */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {/* BARRA DE BÚSQUEDA */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar clientes..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  RUT
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Empresa
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Encargado
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Teléfono
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ciudad
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredClients().map(client => (
                <tr 
                  key={client.id} 
                  className={`border-t transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {/* RUT */}
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.rut}
                  </td>
                  
                  {/* Empresa */}
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.empresa}
                  </td>
                  
                  {/* Encargado */}
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {client.encargado}
                  </td>
                  
                  {/* Email */}
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <a 
                      href={`mailto:${client.email}`}
                      className={`transition-colors ${
                        theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                        theme === 'green' ? 'text-green-600 hover:text-green-800' :
                        theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                        theme === 'red' ? 'text-red-600 hover:text-red-800' :
                        'text-gray-600 hover:text-gray-800'
                      } ${darkMode ? 'hover:text-opacity-80' : ''}`}
                      title={`Enviar email a ${client.email}`}
                    >
                      {client.email}
                    </a>
                  </td>
                  
                  {/* Teléfono */}
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <a 
                      href={`tel:${client.telefono}`}
                      className={`transition-colors ${
                        theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                        theme === 'green' ? 'text-green-600 hover:text-green-800' :
                        theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                        theme === 'red' ? 'text-red-600 hover:text-red-800' :
                        'text-gray-600 hover:text-gray-800'
                      } ${darkMode ? 'hover:text-opacity-80' : ''}`}
                      title={`Llamar a ${client.telefono}`}
                    >
                      {client.telefono}
                    </a>
                  </td>
                  
                  {/* Ciudad */}
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {client.ciudad}
                  </td>
                  
                  {/* Acciones */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {/* Botón Editar */}
                      <button
                        onClick={() => startEdit('client', client)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'blue' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          theme === 'green' ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          theme === 'purple' ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          theme === 'red' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' :
                          'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        } ${darkMode ? 'hover:bg-opacity-20' : ''}`}
                        title="Editar cliente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      {/* Botón WhatsApp (si tiene teléfono) */}
                      {client.telefono && (
                        <button
                          onClick={() => {
                            const phoneNumber = client.telefono.replace(/\D/g, '');
                            const message = `¡Hola ${client.encargado}! Te saludo desde ${data.company?.razonSocial || 'nuestra empresa'}. ¿Cómo estás?`;
                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                          className={`p-1 text-green-600 hover:text-green-800 rounded transition-colors ${
                            darkMode ? 'hover:bg-green-100 hover:bg-opacity-20' : 'hover:bg-green-100'
                          }`}
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Botón Eliminar */}
                      <button
                        onClick={() => deleteItem('clients', client.id)}
                        className={`p-1 text-red-600 hover:text-red-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                        }`}
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MENSAJE CUANDO NO HAY CLIENTES */}
          {getFilteredClients().length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-2">No hay clientes registrados</p>
              <p className="text-sm">
                {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda.' : 'Comienza agregando tu primer cliente.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    setModalType('client');
                    setShowModal(true);
                  }}
                  className={`mt-4 inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Cliente</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  // COMPONENTE VISTA DE SERVICIOS
  const ServicesView = () => (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
          <p className="text-gray-600 mt-2">Gestiona tu catálogo de servicios</p>
        </div>
        <button
          onClick={() => {
            setModalType('service');
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar servicios..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Nombre</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Categoría</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Precio</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Estado</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredServices().map(service => (
                <tr key={service.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{service.name}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">${service.price.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {service.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit('service', service)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('services', service.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

// COMPONENTE CONFIGURACIÓN DE EMPRESA
const CompanySettingsView = () => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Configuración de Empresa
        </h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          Administra la información de tu empresa y personalización
        </p>
      </div>

      {/* INFORMACIÓN DE LA EMPRESA */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 mb-6`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Información de la Empresa
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Razón Social
              </label>
              <input
                type="text"
                value={data.company?.razonSocial || ''}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                RUT
              </label>
              <input
                type="text"
                value={data.company?.rut || ''}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Dirección
            </label>
            <input
              type="text"
              value={data.company?.direccion || ''}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Ciudad
              </label>
              <input
                type="text"
                value={data.company?.ciudad || ''}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Región
              </label>
              <input
                type="text"
                value={data.company?.region || ''}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Teléfono
              </label>
              <input
                type="tel"
                value={data.company?.telefono || ''}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Email
              </label>
              <input
                type="email"
                value={data.company?.email || ''}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* PERSONALIZACIÓN Y BRANDING */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Personalización y Branding
        </h2>
        
        <div className="space-y-6">
          {/* LOGO DE LA EMPRESA */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Logo de la Empresa
            </label>
            <div className="flex items-start space-x-4">
              {/* Preview del logo */}
              <div className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                {data.company?.logo || newCompanyLogo ? (
                  <img 
                    src={newCompanyLogo || data.company.logo} 
                    alt="Logo empresa" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Sin logo</span>
                  </div>
                )}
              </div>
              
              {/* Controles del logo */}
              <div className="flex-1">
                <div className="flex space-x-3">
                  <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${currentTheme.buttonBg} ${currentTheme.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.focus} transition-colors`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Subir Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, setNewCompanyLogo, setData)}
                      className="hidden"
                    />
                  </label>
                  
                  {(data.company?.logo || newCompanyLogo) && (
                    <button
                      onClick={() => removeLogo(setNewCompanyLogo, setData)}
                      className={`px-4 py-2 border text-sm font-medium rounded-md transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                  Formatos soportados: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* SELECTOR DE TEMA */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Tema de Colores
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleThemeChange('blue', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-blue-600 hover:scale-105 ${
                  theme === 'blue' 
                    ? 'border-blue-600 ring-2 ring-blue-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Azul"
              />
              <button
                onClick={() => handleThemeChange('green', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-green-600 hover:scale-105 ${
                  theme === 'green' 
                    ? 'border-green-600 ring-2 ring-green-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Verde"
              />
              <button
                onClick={() => handleThemeChange('purple', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-purple-600 hover:scale-105 ${
                  theme === 'purple' 
                    ? 'border-purple-600 ring-2 ring-purple-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Morado"
              />
              <button
                onClick={() => handleThemeChange('red', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-red-600 hover:scale-105 ${
                  theme === 'red' 
                    ? 'border-red-600 ring-2 ring-red-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Rojo"
              />
              <button
                onClick={() => handleThemeChange('gray', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-gray-600 hover:scale-105 ${
                  theme === 'gray' 
                    ? 'border-gray-600 ring-2 ring-gray-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Gris"
              />
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
              Tema actual: <span className="capitalize font-medium">{theme}</span>
            </p>
          </div>

          {/* MODO OSCURO */}
          <div className="flex items-center justify-between">
            <div>
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Modo Oscuro
              </label>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Activa el tema oscuro para una experiencia visual más cómoda
              </p>
            </div>
            <button
              onClick={() => toggleDarkMode(darkMode, setDarkMode)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${currentTheme.focus} focus:ring-offset-2 ${
                darkMode ? currentTheme.buttonBg : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Activar modo oscuro</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* BOTÓN GUARDAR */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => saveCompanySettings(data, theme, darkMode)}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${currentTheme.buttonBg} ${currentTheme.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.focus} transition-colors`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  // RENDER PRINCIPAL
  return (
    <div className="min-h-screen bg-gray-50">
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
        />
      ) : (
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'quotations' && <QuotationsView />}
            {currentView === 'clients' && <ClientsView />}
            {currentView === 'services' && <ServicesView />}
            {currentView === 'company' && <CompanySettingsView />}
          </div>
        </div>
      )}

      {/* MODALES */}
      {showModal && modalType === 'quotation' && (
        <QuotationModal
          isEditing={editingQuotation !== null}
          quotationData={editingQuotation || newQuotation}
          data={data}
          onCancel={cancelEdit}
          onSave={saveQuotation}
          onAddItem={addQuotationItem}
          onUpdateItem={updateQuotationItem}
          onRemoveItem={removeQuotationItem}
          onFieldChange={handleQuotationFieldChange}
          calculateQuotationTotals={calculateQuotationTotals}
        />
      )}
      {showModal && modalType === 'client' && (
        <ClientModal
          isEditing={editingClient !== null}
          clientData={editingClient || newClient}
          onCancel={cancelEdit}
          onSave={saveClient}
          onFieldChange={handleClientFieldChange}
          formatRut={formatRut}
          validateRut={validateRut}
          validateEmail={validateEmail}
        />
      )}
      {showModal && modalType === 'service' && (
        <ServiceModal
          isEditing={editingService !== null}
          serviceData={editingService || newService}
          onCancel={cancelEdit}
          onSave={saveService}
          onFieldChange={handleServiceFieldChange}
        />
      )}

      {/* SISTEMA DE NOTIFICACIONES */}
      <NotificationContainer />

      {/* PANEL DE FILTROS AVANZADOS */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filtros Avanzados</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto Mínimo</label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto Máximo</label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="999999"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Limpiar Todo
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

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
