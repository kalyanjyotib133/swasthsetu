// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  timestamp: string;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function analyzeSymptoms(symptoms: {
  fever: boolean;
  cough: boolean;
  fatigue: boolean;
  otherSymptoms?: string;
}): Promise<{
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  severity: number;
}> {
  try {
    // In a real implementation, this would call OpenAI API
    // For now, we'll use simple logic
    
    const symptomCount = [symptoms.fever, symptoms.cough, symptoms.fatigue].filter(Boolean).length;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let recommendation = 'No immediate medical attention required. Continue regular health monitoring.';
    let severity = 1;
    
    if (symptomCount >= 2) {
      riskLevel = 'high';
      recommendation = 'Please visit the nearest health center for evaluation.';
      severity = 3;
    } else if (symptomCount === 1) {
      riskLevel = 'medium';
      recommendation = 'Monitor symptoms and consider visiting a health center if they persist.';
      severity = 2;
    }
    
    return { riskLevel, recommendation, severity };
  } catch (error) {
    console.error('Symptom analysis error:', error);
    throw error;
  }
}
