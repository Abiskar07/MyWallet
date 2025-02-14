import { CreateTransactionDTO, TransactionType } from './transaction';

interface AIResponse {
  amount: number;
  type: TransactionType;
  description: string;
  category?: string;
  location?: string;
}

export const aiService = {
  async parseTransactionText(text: string): Promise<AIResponse> {
    try {
      // TODO: Implement DeepSeek API integration
      // For now, return a mock implementation
      const words = text.toLowerCase().split(' ');
      const amount = parseFloat(words.find(w => !isNaN(Number(w))) || '0');
      const type: TransactionType = words.includes('received') ? 'INCOME' : 'EXPENSE';
      
      return {
        amount,
        type,
        description: text,
        category: words.find(w => ['food', 'transport', 'salary', 'rent'].includes(w)),
      };
    } catch (error) {
      throw new Error('Failed to parse transaction text');
    }
  }
}; 