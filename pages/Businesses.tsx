
import React, { useEffect, useState } from 'react';
import { fetchBusinesses, saveBusiness, deleteBusiness, fetchCategories } from '../supabaseClient';
import { Business, Category } from '../types';
import { Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Select } from '../components/ui/Primitives';

const BusinessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  business?: Business | null;
  categories: Category[];
}> = ({ isOpen, onClose, onSave, business, categories }) => {
  const [formData, setFormData] = useState<Partial<Business>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData({ ...business });
    } else {
      setFormData({ category: categories[0]?.id || '', services: [], paymentOptions: [], homeDelivery: false });
    }
  }, [business, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveBusiness(formData);
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = (method: string) => {
    const current = formData.paymentOptions || [];
    if (current.includes(method)) {
      setFormData({ ...formData, paymentOptions: current.filter(p => p !== method) });
    } else {
      setFormData({ ...formData, paymentOptions: [...current, method] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeInUp">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col border">
        <div className="flex items-center justify-between border-b p-4 bg-muted/20">
          <div>
            <h3 className="text-lg font-semibold">{business ? 'Edit Business' : 'Add New Business'}</h3>
            <p className="text-xs text-muted-foreground">Fill in the details below</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-sm font-medium">Shop Name</label>
               <Input 
                 value={formData.shopName || ''} 
                 onChange={e => setFormData({...formData, shopName: e.target.value})}
                 required 
                 placeholder="e.g. Sai General Store"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Owner Name</label>
               <Input 
                 value={formData.ownerName || ''} 
                 onChange={e => setFormData({...formData, ownerName: e.target.value})}
                 required 
                 placeholder="e.g. Rajesh Kumar"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Category</label>
               <Select
                 value={formData.category}
                 onChange={e => setFormData({...formData, category: e.target.value})}
               >
                 {categories.map(cat => (
                   <option key={cat.id} value={cat.id}>{cat.name}</option>
                 ))}
               </Select>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Contact Number</label>
               <Input 
                 value={formData.contactNumber || ''} 
                 onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                 required 
                 placeholder="10 digit mobile number"
               />
            </div>
            <div className="col-span-2 space-y-2">
               <label className="text-sm font-medium">Address</label>
               <Input 
                 value={formData.address || ''} 
                 onChange={e => setFormData({...formData, address: e.target.value})}
                 placeholder="Full local address"
               />
            </div>
             <div className="col-span-2 space-y-2">
               <label className="text-sm font-medium">Opening Hours</label>
               <Input 
                 value={formData.openingHours || ''} 
                 onChange={e => setFormData({...formData, openingHours: e.target.value})}
                 placeholder="e.g. 9 AM - 8 PM"
               />
            </div>
            <div className="col-span-2 space-y-2">
               <label className="text-sm font-medium">Services (comma separated)</label>
               <Input 
                 value={formData.services?.join(', ') || ''} 
                 onChange={e => setFormData({...formData, services: e.target.value.split(',').map(s => s.trim())})}
                 placeholder="e.g. Xerox, Printing, Scanning"
               />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm font-medium">Configurations</p>
            <div className="flex flex-wrap gap-4 border p-3 rounded-md bg-muted/10">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.homeDelivery || false}
                    onChange={e => setFormData({...formData, homeDelivery: e.target.checked})}
                    className="rounded border-input accent-primary w-4 h-4"
                  />
                  <span>Offer Home Delivery?</span>
                </label>
            </div>

            <p className="text-sm font-medium mt-2">Payment Options</p>
             <div className="flex flex-wrap gap-2">
                {['Cash', 'UPI', 'Card'].map(method => (
                  <div 
                    key={method}
                    onClick={() => togglePayment(method)}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border transition-all ${
                      formData.paymentOptions?.includes(method) 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-background hover:bg-muted border-input'
                    }`}
                  >
                    {method} {formData.paymentOptions?.includes(method) && '✓'}
                  </div>
                ))}
             </div>
          </div>

          <div className="border-t pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Business'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Businesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bData, cData] = await Promise.all([
        fetchBusinesses(),
        fetchCategories()
      ]);
      setBusinesses(bData);
      setCategories(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this business?')) {
      await deleteBusiness(id);
      loadData();
    }
  };

  const filtered = businesses.filter(b => {
    const matchesSearch = b.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeInUp max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-lg border border-muted">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase">Total Businesses</span>
          <span className="text-2xl font-bold text-primary">{businesses.length}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase">With Delivery</span>
          <span className="text-2xl font-bold text-green-600">
            {businesses.filter(b => b.homeDelivery).length}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase">UPI Enabled</span>
          <span className="text-2xl font-bold text-blue-600">
             {businesses.filter(b => b.paymentOptions?.includes('UPI')).length}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <i className="fas fa-search absolute left-3 top-3 text-muted-foreground text-xs"></i>
            <Input
              placeholder="Search shop or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)} 
            className="w-40"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <Button onClick={() => { setEditingBusiness(null); setModalOpen(true); }} className="gap-2">
          <i className="fas fa-plus"></i> Add New
        </Button>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Business Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <i className="fas fa-spinner fa-spin text-2xl"></i>
                    <span>Fetching directory...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  No businesses found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((business) => (
                <TableRow key={business.id} className="group hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">{business.shopName}</span>
                      <span className="text-xs text-muted-foreground">{business.ownerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                       {categories.find(c => c.id === business.category)?.name || business.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {business.homeDelivery && (
                        <Badge variant="success" className="gap-1">
                           <i className="fas fa-motorcycle text-[10px]"></i>
                        </Badge>
                      )}
                      {business.paymentOptions?.includes('UPI') && (
                        <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0 bg-white">
                           UPI
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {business.contactNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={() => { setEditingBusiness(business); setModalOpen(true); }}
                      >
                        <i className="fas fa-pencil-alt mr-1"></i> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => handleDelete(business.id)}
                      >
                        <i className="fas fa-trash-alt mr-1"></i> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BusinessModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={loadData}
        business={editingBusiness}
        categories={categories}
      />
    </div>
  );
};

export default Businesses;
