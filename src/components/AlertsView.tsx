import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from '../types/index';
import { Filter, ChevronDown } from 'lucide-react';

export function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'critical'>('all');

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('alerts').select('*');

      if (filter === 'new') {
        query = query.eq('status', 'new');
      } else if (filter === 'critical') {
        query = query.eq('severity', 'critical');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data as Alert[]);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId: string, newStatus: Alert['status']) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      await fetchAlerts();
    } catch (err) {
      console.error('Failed to update alert:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Alerts</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
          >
            <option value="all">All Alerts</option>
            <option value="new">New</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading...</div>
      ) : alerts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">No alerts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onStatusChange={(newStatus) => updateAlertStatus(alert.id, newStatus)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertRow({
  alert,
  onStatusChange,
}: {
  alert: Alert;
  onStatusChange: (status: Alert['status']) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold">{alert.rule_name}</h3>
          <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${
              alert.severity === 'critical'
                ? 'bg-red-900 text-red-200'
                : alert.severity === 'high'
                ? 'bg-orange-900 text-orange-200'
                : alert.severity === 'medium'
                ? 'bg-yellow-900 text-yellow-200'
                : 'bg-slate-700 text-slate-200'
            }`}
          >
            {alert.severity}
          </span>
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${
              alert.status === 'new'
                ? 'bg-blue-900 text-blue-200'
                : alert.status === 'confirmed'
                ? 'bg-red-900 text-red-200'
                : alert.status === 'false_positive'
                ? 'bg-green-900 text-green-200'
                : 'bg-slate-700 text-slate-200'
            }`}
          >
            {alert.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {alert.host_id && <span>Host: {alert.host_id}</span>}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Actions
            <ChevronDown className={`w-4 h-4 transition-transform ${showActions ? 'rotate-180' : ''}`} />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 whitespace-nowrap">
              <button
                onClick={() => {
                  onStatusChange('investigating');
                  setShowActions(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 first:rounded-t-lg"
              >
                Mark as Investigating
              </button>
              <button
                onClick={() => {
                  onStatusChange('confirmed');
                  setShowActions(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Confirm Alert
              </button>
              <button
                onClick={() => {
                  onStatusChange('false_positive');
                  setShowActions(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 last:rounded-b-lg"
              >
                Mark as False Positive
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
