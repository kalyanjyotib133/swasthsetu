import { supabase } from './supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAuthHeaders } from './auth';

// Real-time health data types
export interface LiveHealthData {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  steps: number;
  sleepHours: number;
  sleepQuality: number;
  timestamp: string;
}

export interface HealthAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface HealthGoal {
  id: string;
  type: 'steps' | 'sleep' | 'heart_rate' | 'water' | 'exercise';
  current: number;
  target: number;
  unit: string;
  progress: number;
  lastUpdated: string;
}

// Real-time subscriptions manager
class RealtimeManager {
  private subscriptions: Map<string, any> = new Map();
  private listeners: Map<string, Set<Function>> = new Map();

  // Subscribe to health data updates
  subscribeToHealthData(userId: string, callback: (data: LiveHealthData) => void) {
    const channel = supabase
      .channel(`health_data_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_records',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Health data update:', payload);
          // Transform the data and call callback
          const transformedData = this.transformHealthRecord(payload.new);
          if (transformedData) {
            callback(transformedData);
          }
        }
      )
      .subscribe();

    this.subscriptions.set(`health_${userId}`, channel);
    this.listeners.set(`health_${userId}`, new Set([callback]));

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`health_${userId}`);
      this.listeners.delete(`health_${userId}`);
    };
  }

  // Subscribe to alerts
  subscribeToAlerts(userId: string, callback: (alert: HealthAlert) => void) {
    const channel = supabase
      .channel(`alerts_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `migrant_id=eq.${userId}`
        },
        (payload) => {
          console.log('New alert:', payload);
          const alert = this.transformAlert(payload.new);
          callback(alert);
        }
      )
      .subscribe();

    this.subscriptions.set(`alerts_${userId}`, channel);

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`alerts_${userId}`);
    };
  }

  // Subscribe to goal updates
  subscribeToGoals(userId: string, callback: (goals: HealthGoal[]) => void) {
    const channel = supabase
      .channel(`goals_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_goals',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          // Fetch updated goals
          const updatedGoals = await this.fetchGoals(userId);
          callback(updatedGoals);
        }
      )
      .subscribe();

    this.subscriptions.set(`goals_${userId}`, channel);

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`goals_${userId}`);
    };
  }

  // Transform health record data
  private transformHealthRecord(record: any): LiveHealthData | null {
    if (!record || !record.metadata) return null;

    const metadata = record.metadata;
    return {
      heartRate: metadata.heart_rate || 72,
      bloodPressure: {
        systolic: metadata.systolic || 120,
        diastolic: metadata.diastolic || 80
      },
      temperature: metadata.temperature || 98.6,
      oxygenSaturation: metadata.oxygen_saturation || 98,
      steps: metadata.steps || 0,
      sleepHours: metadata.sleep_hours || 0,
      sleepQuality: metadata.sleep_quality || 0,
      timestamp: record.created_at || new Date().toISOString()
    };
  }

  // Transform alert data
  private transformAlert(alert: any): HealthAlert {
    return {
      id: alert.id,
      type: alert.type === 'urgent' ? 'error' : alert.type === 'warning' ? 'warning' : 'info',
      title: alert.title,
      message: alert.message,
      timestamp: alert.created_at,
      read: alert.is_read || false
    };
  }

  // Fetch current goals
  private async fetchGoals(userId: string): Promise<HealthGoal[]> {
    try {
      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data?.map(goal => ({
        id: goal.id,
        type: goal.goal_type,
        current: goal.current_value,
        target: goal.target_value,
        unit: goal.unit,
        progress: Math.min((goal.current_value / goal.target_value) * 100, 100),
        lastUpdated: goal.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  // Cleanup all subscriptions
  cleanup(userId: string) {
    [`health_${userId}`, `alerts_${userId}`, `goals_${userId}`].forEach(key => {
      const subscription = this.subscriptions.get(key);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(key);
        this.listeners.delete(key);
      }
    });
  }
}

// Create singleton instance
export const realtimeManager = new RealtimeManager();

// React hooks for real-time data
export const useLiveHealthData = (userId: string) => {
  const [data, setData] = useState<LiveHealthData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = realtimeManager.subscribeToHealthData(userId, (newData) => {
      setData(newData);
      setIsConnected(true);
    });

    return unsubscribe;
  }, [userId]);

  return { data, isConnected };
};

export const useLiveAlerts = (userId: string) => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = realtimeManager.subscribeToAlerts(userId, (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);

      // Invalidate alerts query to refresh
      queryClient.invalidateQueries({ queryKey: ['alerts', userId] });
    });

    return unsubscribe;
  }, [userId, queryClient]);

  return { alerts };
};

export const useLiveGoals = (userId: string) => {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = realtimeManager.subscribeToGoals(userId, (updatedGoals) => {
      setGoals(updatedGoals);

      // Invalidate goals query to refresh
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    });

    return unsubscribe;
  }, [userId, queryClient]);

  return { goals };
};

// Utility function to send real-time updates
export const sendHealthUpdate = async (userId: string, healthData: Partial<LiveHealthData>) => {
  try {
    const { error } = await supabase
      .from('health_records')
      .insert({
        user_id: userId,
        record_type: 'vitals',
        title: 'Live Health Update',
        metadata: healthData,
        date: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error sending health update:', error);
    return { success: false, error };
  }
};

// Health data simulation for demo purposes
export const simulateHealthData = (userId: string) => {
  const baseHeartRate = 70 + Math.random() * 20; // 70-90 bpm
  const baseSteps = 8000 + Math.random() * 4000; // 8000-12000 steps

  const mockData: LiveHealthData = {
    heartRate: Math.round(baseHeartRate),
    bloodPressure: {
      systolic: Math.round(110 + Math.random() * 20), // 110-130
      diastolic: Math.round(70 + Math.random() * 15)   // 70-85
    },
    temperature: Math.round((98 + Math.random() * 2) * 10) / 10, // 98.0-100.0
    oxygenSaturation: Math.round(95 + Math.random() * 4), // 95-99
    steps: Math.round(baseSteps),
    sleepHours: Math.round((6 + Math.random() * 3) * 10) / 10, // 6.0-9.0 hours
    sleepQuality: Math.round(70 + Math.random() * 30), // 70-100
    timestamp: new Date().toISOString()
  };

  // Send update every 30 seconds (for demo)
  setInterval(() => {
    sendHealthUpdate(userId, mockData);
  }, 30000);

  return mockData;
};