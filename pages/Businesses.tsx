import React, { useEffect, useState } from 'react';
import { fetchBusinesses, saveBusiness, deleteBusiness, fetchCategories } from '../supabaseClient';
import { Business, Category } from '../types';
import { Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '../components/ui/Primitives';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{business ? 'Edit Business' : 'Add New Business'}</h3>
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
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Owner Name</label>
               <Input 
                 value={formData.ownerName || ''} 
                 onChange={e => setFormData({...formData, ownerName: e.target.value})}
                 required 
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Category</label>
               <select 
                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                 value={formData.category}
                 onChange={e => setFormData({...formData, category: e.target.value})}
               >
                 {categories.map(cat => (
                   <option key={cat.id} value={cat.id}>{cat.name}</option>
                 ))}
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Contact</label>
               <Input 
                 value={formData.contactNumber || ''} 
                 onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                 required 
               />
            </div>
            <div className="col-span-2 space-y-2">
               <label className="text-sm font-medium">Address</label>
               <Input 
                 value={formData.address || ''} 
                 onChange={e => setFormData({...formData, address: e.target.value})}
               />
            </div>
            <div className="col-span-2 space-y-2">
               <label className="text-sm font-medium">Services (comma separated)</label>
               <Input 
                 value={formData.services?.join(', ') || ''} 
                 onChange={e => setFormData({...formData, services: e.target.value.split(',').map(s => s.trim())})}
               />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={formData.homeDelivery || false}
                onChange={e => setFormData({...formData, homeDelivery: e.target.checked})}
                className="rounded border-input"
              />
              Home Delivery
            </label>
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

  const filtered = businesses.filter(b => 
    b.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Businesses</h2>
        <Button onClick={() => { setEditingBusiness(null); setModalOpen(true); }}>
          <i className="fas fa-plus mr-2"></i> Add Business
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Loading data...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.shopName}</TableCell>
                  <TableCell>{business.ownerName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                       {categories.find(c => c.id === business.category)?.name || business.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{business.contactNumber}</TableCell>
                  <TableCell>
                    {business.homeDelivery && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivery</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setEditingBusiness(business); setModalOpen(true); }}
                      >
                        <i className="fas fa-edit h-4 w-4"></i>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(business.id)}
                      >
                        <i className="fas fa-trash h-4 w-4"></i>
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