import { supabase } from './config';
import { ActivityLog } from '@/types';

export const logActivity = async (
  action: ActivityLog['action'],
  entityType: ActivityLog['entityType'],
  entityId: string,
  performedBy: string,
  details?: Record<string, any>
): Promise<string> => {
  const logData = {
    action,
    entity_type: entityType,
    entity_id: entityId,
    performed_by: performedBy,
    details,
  };

  const { data, error } = await supabase
    .from('logs')
    .insert([logData])
    .select()
    .single();

  if (error) throw error;

  return data.id;
};

export const getRecentLogs = async (limitCount: number = 50): Promise<ActivityLog[]> => {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limitCount);

  if (error) throw error;

  return (data || []).map(convertToLog);
};

function convertToLog(data: any): ActivityLog {
  return {
    id: data.id,
    action: data.action,
    entityType: data.entity_type,
    entityId: data.entity_id,
    performedBy: data.performed_by,
    details: data.details,
    timestamp: data.timestamp,
  };
}
