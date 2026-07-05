const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category?: Category;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  total: number;
  status: string;
  idempotency_key: string | null;
  items?: OrderItem[];
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  // Handle empty responses (204 No Content, etc.)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // Fallback for non-JSON responses
  return undefined as T;
}

export async function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>('/categories');
}

export async function getProducts(params?: {
  search?: string;
  category_id?: number;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Product>> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set('search', params.search);
  if (params?.category_id) queryParams.set('category_id', String(params.category_id));
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));

  const query = queryParams.toString();
  return fetchAPI<PaginatedResponse<Product>>(`/products${query ? `?${query}` : ''}`);
}

export async function getProduct(id: number): Promise<Product> {
  return fetchAPI<Product>(`/products/${id}`);
}

export async function createOrder(
  data: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    shipping_address: string;
    shipping_city?: string;
    shipping_postal_code?: string;
    items: Array<{ product_id: number; quantity: number }>;
  },
  idempotencyKey?: string
): Promise<{ id: number; order_number: string; total: number; items: OrderItem[] }> {
  return fetchAPI(`/orders`, {
    method: 'POST',
    headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    body: JSON.stringify(data),
  });
}

export async function getOrder(id: number): Promise<Order> {
  return fetchAPI<Order>(`/orders/${id}`);
}

const getAdminToken = () => process.env.NEXT_PUBLIC_ADMIN_TOKEN || '';

export async function createProduct(data: Omit<Product, 'id' | 'category'>): Promise<Product> {
  return fetchAPI<Product>('/admin/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Omit<Product, 'id' | 'category'>): Promise<Product> {
  return fetchAPI<Product>(`/admin/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return fetchAPI<void>(`/admin/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
}

export async function getOrders(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Order>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));

  const query = queryParams.toString();
  return fetchAPI<PaginatedResponse<Order>>(`/admin/orders${query ? `?${query}` : ''}`, {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
}
