import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Función para formatear RUT chileno
export function formatRut(value) {
  const cleanRut = value.replace(/[^\dkK]/g, '');
  if (cleanRut.length <= 1) return cleanRut;
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
}

// Función para validar RUT chileno
export function validateRut(rut) {
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
}

// Función para validar email
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Función para formatear moneda chilena
export function formatCurrency(amount, currency = 'CLP') {
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
}

// Función para formatear fecha
export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
  } catch (error) {
    return dateString;
  }
}

// Función para calcular fecha válida hasta (30 días después)
export function calculateValidUntilDate(fromDate) {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
}

// Función para calcular totales de cotización
export function calculateQuotationTotals(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const iva = subtotal * 0.19;
  const totalBruto = subtotal + iva;
  const discountAmount = totalBruto * (discount / 100);
  const total = totalBruto - discountAmount;
  return { subtotal, iva, totalBruto, discountAmount, total };
}

// Función para generar número de cotización
export function generateQuotationNumber(existingQuotations = []) {
  const currentYear = new Date().getFullYear();
  const maxId = Math.max(...(existingQuotations.map(q => q.id) || [0]), 0);
  const newId = maxId + 1;
  return `COT-${currentYear}-${String(newId).padStart(3, '0')}`;
}

// Función para limpiar número de teléfono para WhatsApp
export function cleanPhoneNumber(phone) {
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned.startsWith('56') ? cleaned : `56${cleaned.slice(-8)}`;
}