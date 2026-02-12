import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, AlertCircle, Shield, Zap, TrendingUp } from 'lucide-react';
import { Alert } from '../types/index';
import { AlertsView } from './AlertsView';
import { IncidentsView } from './IncidentsView';
import { RulesView } from './RulesView';

type ViewType = 'overview' | 'alerts' | 'incidents' | 'rules';

export function Dashboard() {
  const { signOut } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const alertsData = data as Alert[];
      setAlerts(alertsData);

      const criticalCount = alertsData.filter(a => a.severity === 'critical').length;
      const highCount = alertsData.filter(a => a.severity === 'high').length;
      const newCount = alertsData.filter(a => a.status === 'new').length;

      setStats({
        total: alertsData.length,
        critical: criticalCount,
        high: highCount,
        new: newCount,
      });
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">XDR Platform</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="flex gap-2 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeView === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('alerts')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeView === 'alerts'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveView('incidents')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeView === 'incidents'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => setActiveView('rules')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeView === 'rules'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Detection Rules
          </button>
        </nav>

        {activeView === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Security Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Alerts"
                value={stats.total}
                icon={AlertCircle}
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                title="Critical"
                value={stats.critical}
                icon={Zap}
                color="from-red-500 to-orange-500"
              />
              <StatCard
                title="High Severity"
                value={stats.high}
                icon={Shield}
                color="from-yellow-500 to-orange-500"
              />
              <StatCard
                title="New Alerts"
                value={stats.new}
                icon={TrendingUp}
                color="from-purple-500 to-pink-500"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Alerts</h3>
              {loading ? (
                <div className="text-slate-400 text-center py-8">Loading...</div>
              ) : alerts.length === 0 ? (
                <div className="text-slate-400 text-center py-8">No alerts yet</div>
              ) : (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{alert.rule_name}</p>
                        <p className="text-sm text-slate-400">{alert.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
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
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'alerts' && <AlertsView />}
        {activeView === 'incidents' && <IncidentsView />}
        {activeView === 'rules' && <RulesView />}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className: string }>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`bg-gradient-to-r ${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
