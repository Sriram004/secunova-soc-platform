export interface DetectionRule {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'active' | 'disabled' | 'testing';
  detection: Record<string, any>;
  fields: string[];
  false_positives: string[];
  tags: string[];
  rule_references: string[];
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  rule_id?: string;
  rule_name: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  event_id?: string;
  incident_id?: string;
  description?: string;
  matched_fields: Record<string, any>;
  host_id?: string;
  user_id_alert?: string;
  false_positive: boolean;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  user_id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  alert_ids: string[];
  entity_type?: string;
  entity_id?: string;
  attack_chain: string[];
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  timestamp: string;
  host_id?: string;
  user_id_event?: string;
  process_name?: string;
  event_category?: string;
  raw_data: Record<string, any>;
  created_at: string;
}

export interface Playbook {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger: Record<string, any>;
  steps: Array<Record<string, any>>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaybookExecution {
  id: string;
  playbook_id: string;
  incident_id: string;
  user_id: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'rolled_back';
  steps_completed: number;
  steps_total?: number;
  error_message?: string;
  execution_log: Record<string, any>;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}

export interface ResponseAction {
  id: string;
  user_id: string;
  execution_id?: string;
  action_type: string;
  target_entity?: string;
  status: 'pending' | 'executing' | 'success' | 'failed';
  parameters?: Record<string, any>;
  result?: Record<string, any>;
  error_message?: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  total_alerts: number;
  total_incidents: number;
  active_rules: number;
  alerts_last_24h: number;
  severity_distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}
