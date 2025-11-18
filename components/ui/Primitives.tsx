// Material-UI Wrapper Components
import React from 'react';
import {
  Button as MuiButton,
  TextField,
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Paper,
  Chip,
  Tabs as MuiTabs,
  Tab,
  Box,
  Skeleton as MuiSkeleton,
  ButtonProps as MuiButtonProps,
  TextFieldProps,
  SelectProps as MuiSelectProps,
} from '@mui/material';

// Button
export const Button = React.forwardRef<HTMLButtonElement, MuiButtonProps>(
  ({ variant = 'contained', ...props }, ref) => (
    <MuiButton ref={ref} variant={variant} {...props} />
  )
);

// Input
export const Input = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ ...props }, ref) => (
    <TextField inputRef={ref} fullWidth size="small" {...props} />
  )
);

// Select
export const Select = React.forwardRef<HTMLSelectElement, MuiSelectProps & { children?: React.ReactNode }>(
  ({ children, ...props }, ref) => (
    <FormControl fullWidth size="small">
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <MuiSelect ref={ref as any} {...props}>
        {children}
      </MuiSelect>
    </FormControl>
  )
);

export { MenuItem as SelectItem };

// Card
export const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCard>>(
  ({ ...props }, ref) => <MuiCard ref={ref} {...props} />
);

export const CardHeader = React.forwardRef<HTMLDivElement, { title?: React.ReactNode; subheader?: React.ReactNode }>(
  ({ title, subheader, ...props }, ref) => (
    <MuiCardHeader ref={ref} title={title} subheader={subheader} {...props} />
  )
);

export const CardTitle = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const CardDescription = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardContent>>(
  ({ ...props }, ref) => <MuiCardContent ref={ref} {...props} />
);

// Table
export const Table = ({ children }: { children: React.ReactNode }) => (
  <TableContainer component={Paper}>
    <MuiTable>{children}</MuiTable>
  </TableContainer>
);

export const TableHeader = MuiTableHead;
export const TableBody = MuiTableBody;
export const TableRow = MuiTableRow;
export const TableHead = MuiTableCell;
export const TableCell = MuiTableCell;

// Badge
export const Badge = ({ 
  children, 
  variant = 'default',
  ...props 
}: { 
  children?: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  className?: string;
}) => {
  const colorMap = {
    default: 'primary',
    secondary: 'secondary',
    outline: 'default',
    destructive: 'error',
    success: 'success',
    warning: 'warning',
  };
  
  return <Chip label={children} color={colorMap[variant] as any} size="small" {...props} />;
};

// Tabs
export const Tabs = ({ 
  value, 
  onValueChange, 
  children 
}: { 
  value: string; 
  onValueChange: (v: string) => void; 
  children: React.ReactNode;
}) => {
  return <Box sx={{ width: '100%' }}>{children}</Box>;
};

export const TabsList = ({ 
  value,
  onChange,
  children 
}: { 
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) => (
  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
    <MuiTabs value={value} onChange={(_, newValue) => onChange(newValue)} variant="scrollable">
      {children}
    </MuiTabs>
  </Box>
);

export const TabsTrigger = ({ 
  value, 
  children,
  icon 
}: { 
  value: string; 
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <Tab 
    value={value} 
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        {children}
      </Box>
    } 
  />
);

export const TabsContent = ({ 
  value, 
  active, 
  children 
}: { 
  value: string; 
  active: boolean; 
  children: React.ReactNode;
}) => {
  if (!active) return null;
  return <Box>{children}</Box>;
};

// Skeleton
export const Skeleton = ({ className, ...props }: { className?: string; width?: number | string; height?: number | string }) => (
  <MuiSkeleton variant="rectangular" {...props} />
);
