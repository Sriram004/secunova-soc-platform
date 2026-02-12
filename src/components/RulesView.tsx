import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DetectionRule } from '../types/index';
import { Plus, Filter, Trash2 } from 'lucide-react';

export function RulesView() {
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    severity: 'high' as const,
    description: '',
  });

  useEffect(() => {
    fetchRules();
  }, [filter]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      let query = supabase.from('detection_rules').select('*');

      if (filter !== 'all') {
        query = query.eq('status', filter === 'active' ? 'active' : 'disabled');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data as DetectionRule[]);
    } catch (err) {
      console.error('Failed to fetch rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const createRule = async () => {
    if (!formData.title) return;

    try {
      const { error } = await supabase.from('detection_rules').insert({
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        status: 'active',
        detection: {},
        fields: [],
        false_positives: [],
        tags: [],
      });

      if (error) throw error;

      setFormData({ title: '', severity: 'high', description: '' });
      setShowNewForm(false);
      await fetchRules();
    } catch (err) {
      console.error('Failed to create rule:', err);
    }
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      const { error } = await supabase
        .from('detection_rules')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ruleId);

      if (error) throw error;
      await fetchRules();
    } catch (err) {
      console.error('Failed to update rule:', err);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      const { error } = await supabase
        .from('detection_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
      await fetchRules();
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Detection Rules</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
            >
              <option value="all">All Rules</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Rule
          </button>
        </div>
      </div>

      {showNewForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Rule title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              rows={3}
            />
            <div className="flex gap-2">
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                onClick={createRule}
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
      ) : rules.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">No detection rules found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              onToggleStatus={() => toggleRuleStatus(rule.id, rule.status)}
              onDelete={() => deleteRule(rule.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RuleRow({
  rule,
  onToggleStatus,
  onDelete,
}: {
  rule: DetectionRule;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold">{rule.title}</h3>
          {rule.description && (
            <p className="text-sm text-slate-400 mt-1">{rule.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span
              className={`px-3 py-1 rounded text-xs font-medium ${
                rule.severity === 'critical'
                  ? 'bg-red-900 text-red-200'
                  : rule.severity === 'high'
                  ? 'bg-orange-900 text-orange-200'
                  : rule.severity === 'medium'
                  ? 'bg-yellow-900 text-yellow-200'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {rule.severity}
            </span>
            <button
              onClick={onToggleStatus}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                rule.status === 'active'
                  ? 'bg-green-900 text-green-200 hover:bg-green-800'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {rule.status === 'active' ? 'Active' : 'Disabled'}
            </button>
            {rule.tags && rule.tags.length > 0 && (
              <div className="flex gap-1">
                {rule.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-300">
                    {tag}
                  </span>
                ))}
                {rule.tags.length > 2 && (
                  <span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-300">
                    +{rule.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
