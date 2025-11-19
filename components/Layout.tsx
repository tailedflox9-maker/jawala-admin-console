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
    <TextField 
      inputRef={ref} 
      fullWidth 
      size="small" 
      {...props} 
      sx={{
        '& .MuiInputBase-input': { color: 'inherit' },
        '& .MuiInputLabel-root': { color: 'inherit', opacity: 0.7 },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'hsl(var(--border))' }
      }}
    />
  )
);

// Select
export const Select = React.forwardRef<HTMLSelectElement, MuiSelectProps & { children?: React.ReactNode }>(
  ({ children, ...props }, ref) => (
    <FormControl fullWidth size="small">
      {props.label && <InputLabel sx={{ color: 'inherit', opacity: 0.7 }}>{props.label}</InputLabel>}
      <MuiSelect 
        ref={ref as any} 
        {...props}
        sx={{
            color: 'inherit',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'hsl(var(--border))' },
            '.MuiSvgIcon-root': { color: 'inherit' }
        }}
        MenuProps={{
            PaperProps: {
                className: '!bg-card !text-card-foreground border border-border'
            }
        }}
      >
        {children}
      </MuiSelect>
    </FormControl>
  )
);

export { MenuItem as SelectItem };

// Card - FIXED: Added !bg-card and !text-card-foreground
export const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCard> & { className?: string }>(
  ({ className, ...props }, ref) => (
    <MuiCard 
      ref={ref} 
      className={`!bg-card !text-card-foreground ${className || ''}`} 
      {...props} 
    />
  )
);

export const CardHeader = React.forwardRef<HTMLDivElement, { title?: React.ReactNode; subheader?: React.ReactNode; className?: string }>(
  ({ title, subheader, className, ...props }, ref) => (
    <MuiCardHeader 
      ref={ref} 
      title={<span className="text-foreground font-semibold">{title}</span>} 
      subheader={<span className="text-muted-foreground text-sm">{subheader}</span>} 
      className={className} 
      {...props} 
    />
  )
);

export const CardTitle = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const CardDescription = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardContent>>(
  ({ ...props }, ref) => <MuiCardContent ref={ref} {...props} />
);

// Table - FIXED: Added background colors to container and cells
export const Table = ({ children }: { children: React.ReactNode }) => (
  <TableContainer component={Paper} className="!bg-card !text-card-foreground !shadow-none border-none">
    <MuiTable>{children}</MuiTable>
  </TableContainer>
);

export const TableHeader = MuiTableHead;
export const TableBody = MuiTableBody;
export const TableRow = MuiTableRow;
export const TableHead = ({ children, ...props }: any) => (
    <MuiTableCell {...props} sx={{ color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border))' }}>
        {children}
    </MuiTableCell>
);
export const TableCell = ({ children, ...props }: any) => (
    <MuiTableCell {...props} sx={{ color: 'hsl(var(--foreground))', borderColor: 'hsl(var(--border))' }}>
        {children}
    </MuiTableCell>
);

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
  <Box sx={{ borderBottom: 1, borderColor: 'hsl(var(--border))', mb: 3 }}>
    <MuiTabs 
        value={value} 
        onChange={(_, newValue) => onChange(newValue)} 
        variant="scrollable"
        sx={{
            '& .MuiTab-root': { color: 'hsl(var(--muted-foreground))' },
            '& .Mui-selected': { color: 'hsl(var(--primary)) !important' },
            '& .MuiTabs-indicator': { backgroundColor: 'hsl(var(--primary))' }
        }}
    >
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
  <MuiSkeleton 
    variant="rectangular" 
    {...props} 
    sx={{ bgcolor: 'hsl(var(--muted))' }}
  />
);
