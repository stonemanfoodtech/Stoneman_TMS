export const DESIGNATIONS = [
  'Production Supervisor',
  'Production Operator',
  'Quality Analyst',
  'Food Technologist',
  'Sales Executive',
  'B2B Sales Executive',
  'Marketing Manager',
  'Marketing Associate',
  'Logistics Coordinator',
  'Warehouse Supervisor',
  'Procurement Officer',
  'Maintenance Technician',
  'Accounts Executive',
  'HR Executive',
  'Operations Manager',
  'Other',
];

export const GENDERS = ['Male', 'Female', 'Other'];

export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];

export const STATUS_STYLES = {
  Pending: { chip: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', color: '#f59e0b' },
  'In Progress': { chip: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500', color: '#0ea5e9' },
  Completed: { chip: 'bg-brand-100 text-brand-800', dot: 'bg-brand-600', color: '#0b6a52' },
};

export const HOLIDAY_TYPES = [
  { value: 'national', label: 'National holiday' },
  { value: 'festival', label: 'Festival / gazetted' },
  { value: 'company', label: 'Company holiday' },
];

export const BRAND = {
  name: 'Stoneman Food and Beverages',
  legal: 'Stoneman Food and Beverages Pvt. Ltd.',
  green: '#015442',
  teal: '#0E9384',
  leaf: '#4CAF7E',
  lime: '#B5C74A',
};
