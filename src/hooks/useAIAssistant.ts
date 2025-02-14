import { useState } from 'react';
import { CreateTransactionDTO } from '../services/transaction';

interface AIResponse {
  transaction?: CreateTransactionDTO;
  error?: string;
}

export const useAIAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAICommand = async (command: string): Promise<AIResponse> => {
    setIsProcessing(true);
    try {
      // TODO: Integrate with actual AI service (DeepSeek)
      // This is a temporary mock implementation
      const mockResponse: AIResponse = {
        transaction: {
          amount: 500, // Mock amount
          type: command.toLowerCase().includes('income') ? 'INCOME' : 'EXPENSE',
          description: command,
          date: new Date().toISOString(),
        }
      };
      
      return mockResponse;
    } catch (error) {
      return {
        error: 'Failed to process AI command'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processAICommand
  };
}; 