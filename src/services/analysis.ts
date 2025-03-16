import { LinearRegression } from 'ml-regression-simple-linear';

interface EventData {
  id: number;
  name: string;
  price: string;
  maxResalePrice: string;
  available: number;
  maxSupply: number;
  date: string;
}

interface AnalysisResult {
  event_name: string;
  recommendation: string;
  expected_roi: number;
  risk_level: string;
  confidence_score: number;
  suggested_holding_period: string;
}

class TicketAnalysisService {
  private model: LinearRegression | null = null;

  private calculateRiskLevel(daysUntilEvent: number, availabilityPercentage: number): string {
    if (daysUntilEvent > 30 && availabilityPercentage > 50) {
      return 'Low';
    } else if (daysUntilEvent > 14 || availabilityPercentage > 30) {
      return 'Medium';
    }
    return 'High';
  }

  private calculateROI(originalPrice: number, maxResalePrice: number): number {
    return ((maxResalePrice - originalPrice) / originalPrice) * 100;
  }

  private generateRecommendation(expectedRoi: number, riskLevel: string): string {
    if (expectedRoi > 50 && riskLevel === 'Low') {
      return 'Strong Buy';
    } else if (expectedRoi > 30 && riskLevel !== 'High') {
      return 'Buy';
    } else if (expectedRoi > 15 && riskLevel === 'Low') {
      return 'Moderate Buy';
    } else if (expectedRoi < 0) {
      return 'Avoid';
    }
    return 'Hold';
  }

  public analyzeEvent(event: EventData): AnalysisResult {
    const originalPrice = parseFloat(event.price);
    const maxResalePrice = parseFloat(event.maxResalePrice);
    const availabilityPercentage = (event.available / event.maxSupply) * 100;
    
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    const daysUntilEvent = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    
    const expectedRoi = this.calculateROI(originalPrice, maxResalePrice);
    const riskLevel = this.calculateRiskLevel(daysUntilEvent, availabilityPercentage);
    const recommendation = this.generateRecommendation(expectedRoi, riskLevel);
    
    const confidenceScore = Math.min(100, Math.max(30, 
      100 - availabilityPercentage + (expectedRoi > 30 ? 20 : 0)
    ));

    return {
      event_name: event.name,
      recommendation,
      expected_roi: parseFloat(expectedRoi.toFixed(2)),
      risk_level: riskLevel,
      suggested_holding_period: daysUntilEvent > 30 ? '2-4 weeks' : '1-2 weeks',
      confidence_score: parseFloat(confidenceScore.toFixed(2))
    };
  }
}

export const analysisService = new TicketAnalysisService();