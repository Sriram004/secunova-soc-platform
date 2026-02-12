import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Incident } from '../types/index';
import { Plus, Filter } from 'lucide-react';

export function IncidentsView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating'>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', severity: 'high' as const });

  useEffect(() => {
    fetchIncidents();
  }, [filter]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      let query = supabase.from('incidents').select('*');

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data as Incident[]);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async () => {
    if (!formData.title) return;

    try {
      const { error } = await supabase.from('incidents').insert({
        title: formData.title,
        severity: formData.severity,
        status: 'open',
      });

      if (error) throw error;

      setFormData({ title: '', severity: 'high' });
      setShowNewForm(false);
      await fetchIncidents();
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  const updateIncidentStatus = async (incidentId: string, newStatus: Incident['status']) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', incidentId);

      if (error) throw error;
      await fetchIncidents();
    } catch (err) {
      console.error('Failed to update incident:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Incidents</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
            >
              <option value="all">All Incidents</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
            </select>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Incident
          </button>
        </div>
      </div>

      {showNewForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Incident title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value as any })
                }
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                onClick={createIncident}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading...</div>
      ) : incidents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">No incidents found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => (
            <IncidentRow
              key={incident.id}
              incident={incident}
              onStatusChange={(newStatus) => updateIncidentStatus(incident.id, newStatus)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IncidentRow({
  incident,
  onStatusChange,
}: {
  incident: Incident;
  onStatusChange: (status: Incident['status']) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold">{incident.title}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`px-3 py-1 rounded text-xs font-medium ${
                incident.severity === 'critical'
                  ? 'bg-red-900 text-red-200'
                  : incident.severity === 'high'
                  ? 'bg-orange-900 text-orange-200'
                  : incident.severity === 'medium'
                  ? 'bg-yellow-900 text-yellow-200'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {incident.severity}
            </span>
            <select
              value={incident.status}
              onChange={(e) => onStatusChange(e.target.value as Incident['status'])}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
            >
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="contained">Contained</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {incident.alert_ids?.length || 0} alerts
        </div>
      </div>
    </div>
  );
}
