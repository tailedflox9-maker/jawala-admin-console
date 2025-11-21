import React, { useEffect, useState } from 'react';
import { getDatabaseUsage, downloadTableData, cleanupOldData } from '../supabaseClient';
import { 
  Box, Card, CardContent, Typography, Grid, Button, 
  LinearProgress, Select, MenuItem, FormControl, InputLabel, 
  Alert, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { 
  Storage, CloudDownload, DeleteForever, 
  Warning, CheckCircle, Shield 
} from '@mui/icons-material';

const DataManagement: React.FC = () => {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retention, setRetention] = useState(3);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const loadStats = async () => {
    setLoading(true);
    const data = await getDatabaseUsage();
    setUsage(data);
    setLoading(false);
  };

  useEffect(() => { loadStats(); }, []);

  const handleDownload = async (table: string) => {
    const csvData = await downloadTableData(table);
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${table}_backup_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert('Failed to download data.');
    }
  };

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      const result = await cleanupOldData(retention);
      setLastResult(result);
      await loadStats();
      setConfirmOpen(false);
    } catch (e) {
      alert('Error during cleanup.');
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Storage sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" fontWeight={900}>Data Management</Typography>
        </Box>
        <Typography color="text.secondary">Monitor storage, backup data, and manage database limits.</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Database Row Counts</Typography>
              {loading ? <LinearProgress /> : (
                <Grid container spacing={2}>
                  {[
                    { label: 'Interaction Logs', val: usage?.business_interactions, key: 'business_interactions' },
                    { label: 'Visit Logs', val: usage?.visit_logs, key: 'visit_logs' },
                    { label: 'AI Search Logs', val: usage?.ai_search_logs, key: 'ai_search_logs' },
                  ].map((item) => (
                    <Grid item xs={12} sm={4} key={item.label}>
                      <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                        <Typography variant="h4" fontWeight={800}>{item.val?.toLocaleString()}</Typography>
                        <Button size="small" startIcon={<CloudDownload />} onClick={() => handleDownload(item.key)} sx={{ mt: 1 }}>Download</Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%', bgcolor: '#e3f2fd', borderColor: '#bbdefb' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Shield color="primary" />
                <Typography variant="h6" fontWeight={700} color="primary.main">Protected Data</Typography>
              </Box>
              <Typography variant="h3" fontWeight={900} color="primary.dark">{usage?.unique_users?.toLocaleString()}</Typography>
              <Typography variant="body2" fontWeight={600} color="primary.dark" sx={{ mb: 2 }}>Lifetime Unique Visitors</Typography>
              <Alert severity="info" sx={{ bgcolor: 'white' }}>This data is <strong>never deleted</strong>. It tracks total reach since day one.</Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DeleteForever color="error" />
            <Typography variant="h6" fontWeight={700} color="error">Cleanup Old Logs</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 3 }}>Use this to free up space. Deletes logs older than selected period.</Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Retention Period</InputLabel>
              <Select value={retention} label="Retention Period" onChange={(e) => setRetention(Number(e.target.value))}>
                <MenuItem value={1}>Keep last 1 Month</MenuItem>
                <MenuItem value={3}>Keep last 3 Months</MenuItem>
                <MenuItem value={6}>Keep last 6 Months</MenuItem>
                <MenuItem value={12}>Keep last 1 Year</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="error" startIcon={<DeleteForever />} onClick={() => setConfirmOpen(true)}>Clean Database</Button>
          </Box>

          {lastResult && (
            <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ mt: 3 }}>
              Cleanup Complete! Deleted: {lastResult.visitsDeleted} visits, {lastResult.interactionsDeleted} interactions, {lastResult.aiLogsDeleted} AI logs.
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning color="warning" /> Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete logs older than <strong>{retention} months</strong>?</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>* Cannot be undone.<br/>* Unique User counts are SAFE.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleCleanup} color="error" variant="contained" disabled={isCleaning}>{isCleaning ? 'Deleting...' : 'Yes, Delete'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataManagement;
