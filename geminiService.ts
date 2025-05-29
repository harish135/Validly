

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { 
  ReportData, 
  GeminiReportResponse, 
  SimulatedChartData, 
  SymptomAnalysisResponse, 
  HealthcareNewsItem, 
  GeminiHealthcareNewsResponseItem,
  IngredientAnalysisResponse, 
  GeminiIngredientAnalysisResponseItem,
  ConsumerInsightsResponse,
  GeminiConsumerInsightsResponseItem,
  ComplianceAnalysisResponse, 
  GeminiComplianceAnalysisResponseItem, 
  FormulationAdvisorResponse, 
  GeminiFormulationAdvisorResponseItem,
  RecommendedSpecialistInfo,
  SimulatedComplianceFlag,
  IngredientBenefitOrUse,
  IngredientConsideration,
  FormulationIdea,
  KeySimulatedIngredient,
  SimulatedSource,
  DefinedTerm,
  NuanceItem,
  ForumThread,
  ForumPost,
  GeminiForumThreadSeed,
  ForumAuthorType,
  GeminiQuizResponse,
  // GeminiQuizQuestionSeed, // Already in GeminiQuizResponse
  PreQuizInfo, 
  GeminiSpotTheClaimResponse,
  GeminiLeaderboardEntrySeed,
  LeaderboardEntry
} from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY 
});

const generateId = () => Math.random().toString(36).substr(2, 9);

const checkApiKey = (): boolean => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set. Gemini API calls will fail.");
    return false;
  }
  return true;
};

const parseJsonSafely = <T>(jsonStr: string, defaultDisclaimerOrValue?: string | Partial<T> | Partial<T>[]): Partial<T> | Partial<T>[] => {
  let cleanJsonStr = jsonStr.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanJsonStr.match(fenceRegex);
  if (match && match[1]) {
    cleanJsonStr = match[1].trim();
  }
  try {
    return JSON.parse(cleanJsonStr) as T | T[];
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "\nOriginal string:", jsonStr);
    if (typeof defaultDisclaimerOrValue === 'string') {
        const errorResult: Partial<T> = {};
        if ('criticalDisclaimer' in errorResult) { 
            (errorResult as any).criticalDisclaimer = defaultDisclaimerOrValue;
        } else if ('summary' in errorResult) { 
             (errorResult as any).summary = "Could not parse AI response.";
        } else if ('quizTitle' in errorResult && 'questions' in errorResult) { // For quiz
            (errorResult as any).quizTitle = "Error Quiz";
            (errorResult as any).questions = [];
        }
        return errorResult;
    } else if (defaultDisclaimerOrValue) { 
        return defaultDisclaimerOrValue;
    }
    return Array.isArray(defaultDisclaimerOrValue) ? [] : {};
  }
};


export const generateValidationReport = async (claim: string): Promise<ReportData> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured. Please ensure the API_KEY environment variable is set."));
  }

  const prompt = `
You are an AI research analyst for "Validly", a SaaS tool helping supplement and wellness brands.
Your task is to analyze the following product claim and generate a science-backed validation report.
The report MUST be in JSON format. Respond ONLY with a single, valid JSON object. Do not use markdown fences.

Product Claim: "${claim}"

JSON Output Structure:
{
  "confidenceScore": "Enum('High', 'Medium', 'Low', 'Undetermined')",
  "summary": "A concise summary (2-3 sentences) of the simulated research findings related to the claim. Maintain a neutral, scientific tone.",
  "keyFindings": ["An array of 3-5 strings, each representing a key finding from simulated research."],
  "safePhrasing": ["An array of 2-4 strings, each suggesting legally-safe marketing phrases."],
  "simulatedSources": [
    { "title": "Simulated study title 1", "url": "https://pubmed.ncbi.nlm.nih.gov/example-id-1", "snippet": "Brief snippet from simulated study." }
  ],
  "definedTerms": [ 
    { "term": "Example Term", "definition": "Explanation." }
  ],
  "nuanceAndConsiderations": [
    { "aspect": "Strength of Evidence (Simulated)", "detail": "Commentary on perceived strength." }
  ],
  "simulatedChartData": {
    "chartTitle": "Simulated Search Interest (Last 6 Months)", 
    "dataType": "Approx. Monthly Searches", 
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], 
    "values": [30, 35, 45, 50, 65, 60] 
  },
  "simulatedConsumerSentimentSnippet": "A brief (1-2 sentences) simulated consumer sentiment related to the core subject of the claim. Example: 'Consumers show growing interest in natural stress relief, but are wary of unsubstantiated claims.'",
  "simulatedFormulationAngle": "A short (1-2 sentences) innovative product formulation idea or angle related to the claim. Example: 'Consider a synergistic blend combining this with L-Theanine for enhanced calming effects, delivered in a fast-dissolve oral strip.'",
  "simulatedComplianceTip": "A very brief (1 sentence) general compliance tip relevant to this type of claim. Example: 'Ensure any efficacy claims are accompanied by appropriate disclaimers and are not overstated.'"
}

Detailed Instructions:
- 'simulatedConsumerSentimentSnippet', 'simulatedFormulationAngle', 'simulatedComplianceTip': Provide concise, plausible, and relevant simulated insights for these new fields. They should connect to the main claim's subject matter.
- All other fields: Follow original instructions. Ensure URLs are valid in structure. DefinedTerms, Nuance, and ChartData are optional.
- Ensure the entire response is ONLY the JSON object. No extra text, no markdown.

Analyze the claim "${claim}" and generate the report.
  `;

  let genContentResponse: GenerateContentResponse | undefined;

  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.35, 
      },
    });
    
    const parsedData = parseJsonSafely<GeminiReportResponse>(genContentResponse.text) as GeminiReportResponse;

    const keyFindings = Array.isArray(parsedData.keyFindings) ? parsedData.keyFindings.filter(s => typeof s === 'string') : [];
    const safePhrasing = Array.isArray(parsedData.safePhrasing) ? parsedData.safePhrasing.filter(s => typeof s === 'string') : [];
    const simulatedSources = (Array.isArray(parsedData.simulatedSources) ? parsedData.simulatedSources.filter(s => s && typeof s.title === 'string' && typeof s.url === 'string' && typeof s.snippet === 'string') : []) as SimulatedSource[];
    const definedTerms = (Array.isArray(parsedData.definedTerms) ? parsedData.definedTerms.filter(dt => dt && typeof dt.term === 'string' && typeof dt.definition === 'string') : []) as DefinedTerm[];
    const nuanceAndConsiderations = (Array.isArray(parsedData.nuanceAndConsiderations) ? parsedData.nuanceAndConsiderations.filter(nc => nc && typeof nc.aspect === 'string' && typeof nc.detail === 'string') : []) as NuanceItem[];
    
    let simulatedChartData: SimulatedChartData | undefined = undefined;
    if (parsedData.simulatedChartData && 
        typeof parsedData.simulatedChartData.chartTitle === 'string' &&
        typeof parsedData.simulatedChartData.dataType === 'string' &&
        Array.isArray(parsedData.simulatedChartData.labels) && 
        Array.isArray(parsedData.simulatedChartData.values) &&
        parsedData.simulatedChartData.labels.length > 0 && 
        parsedData.simulatedChartData.labels.length === parsedData.simulatedChartData.values.length &&
        parsedData.simulatedChartData.values.every(v => typeof v === 'number') 
      ) {
      simulatedChartData = parsedData.simulatedChartData as SimulatedChartData;
    }

    return {
      id: generateId(),
      claim: claim,
      confidenceScore: parsedData.confidenceScore || 'Undetermined',
      summary: parsedData.summary || 'AI could not generate a summary for this claim.',
      keyFindings,
      safePhrasing,
      simulatedSources,
      definedTerms,
      nuanceAndConsiderations,
      simulatedChartData,
      generatedTimestamp: Date.now(),
      simulatedConsumerSentimentSnippet: parsedData.simulatedConsumerSentimentSnippet || "AI did not provide specific consumer sentiment.",
      simulatedFormulationAngle: parsedData.simulatedFormulationAngle || "AI did not provide a specific formulation angle.",
      simulatedComplianceTip: parsedData.simulatedComplianceTip || "AI did not provide a specific compliance tip.",
    };

  } catch (error) {
    console.error('Error generating validation report:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
    if (genContentResponse && genContentResponse.text) {
        console.error("Gemini Response Text:", genContentResponse.text);
    }
    return Promise.reject(new Error(`AI Report Generation Failed: ${errorMessage}`));
  }
};


export const analyzeHealthSymptoms = async (symptoms: string): Promise<SymptomAnalysisResponse> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const defaultDisclaimer = "This AI-generated information is for educational purposes ONLY and is NOT medical advice. It should NOT be used for self-diagnosis or treatment. Always consult a qualified healthcare professional for any health concerns.";

  const prompt = `
You are an AI health information assistant for "Validly".
Your task is to analyze the following user-described health symptoms and provide informational insights.
The response MUST be in JSON format. Respond ONLY with a single, valid JSON object. Do not use markdown fences.

User Symptoms: "${symptoms}"

JSON Output Structure:
{
  "aiUnderstandingOfProblem": "A brief summary (1-2 sentences) of how the AI interprets the user's input.",
  "simulatedPotentialAreas": ["An array of 2-4 strings, each describing a general health area or system that might be related, based on simulated knowledge. These are NOT diagnoses."],
  "generalRecommendations": ["An array of 2-3 strings, providing general, non-prescriptive wellness advice. E.g., 'Consider tracking symptoms daily.', 'Ensure adequate hydration.'"],
  "recommendedSpecialist": { 
    "departmentName": "e.g., General Practitioner, Neurologist, Gastroenterologist", 
    "specialistName": "Optional: e.g., Neurologist",
    "simulatedReasoning": "Brief simulated reasoning (1-2 sentences) why consulting this type of specialist might be appropriate." 
  },
  "criticalDisclaimer": "MUST BE: '${defaultDisclaimer}'"
}

Detailed Instructions:
- All fields are mandatory.
- "simulatedPotentialAreas" should be very general and explicitly state they are not diagnoses.
- "generalRecommendations" must be non-medical, common sense wellness tips.
- "recommendedSpecialist" should suggest a type of medical professional for consultation.
- "criticalDisclaimer" MUST be exactly as provided above.
- Ensure the entire response is ONLY the JSON object. No extra text, no markdown.

Analyze symptoms: "${symptoms}"
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.4 },
    });
    
    const parsedData = parseJsonSafely<SymptomAnalysisResponse>(genContentResponse.text, defaultDisclaimer) as SymptomAnalysisResponse;

    const recommendedSpecialist: RecommendedSpecialistInfo = (parsedData.recommendedSpecialist && 
      typeof parsedData.recommendedSpecialist.departmentName === 'string' &&
      typeof parsedData.recommendedSpecialist.simulatedReasoning === 'string') 
      ? {
          departmentName: parsedData.recommendedSpecialist.departmentName,
          specialistName: typeof parsedData.recommendedSpecialist.specialistName === 'string' ? parsedData.recommendedSpecialist.specialistName : undefined,
          simulatedReasoning: parsedData.recommendedSpecialist.simulatedReasoning,
        }
      : { departmentName: 'General Practitioner', simulatedReasoning: 'For a general assessment and potential referral.' };

    return {
      aiUnderstandingOfProblem: parsedData.aiUnderstandingOfProblem || "AI could not fully understand the input.",
      simulatedPotentialAreas: Array.isArray(parsedData.simulatedPotentialAreas) ? parsedData.simulatedPotentialAreas.filter(s => typeof s === 'string') : [],
      generalRecommendations: Array.isArray(parsedData.generalRecommendations) ? parsedData.generalRecommendations.filter(s => typeof s === 'string') : [],
      recommendedSpecialist: recommendedSpecialist,
      criticalDisclaimer: parsedData.criticalDisclaimer || defaultDisclaimer,
    };
  } catch (error) {
    console.error('Error analyzing health symptoms:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Symptom Analysis Failed: ${(error as Error).message}`));
  }
};

export const generateHealthcareNews = async (query: string): Promise<HealthcareNewsItem[]> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const prompt = `
You are an AI news curator for "Validly".
Your task is to generate a list of 5-7 simulated news items based on the query: "${query}".
The news items should cover a diverse range of topics including technology, science, world events, culture, business, finance, lifestyle, and environment.
The response MUST be in JSON format, an array of objects. Respond ONLY with a single, valid JSON array. Do not use markdown fences.

JSON Output Structure for each item:
{
  "title": "Catchy, plausible news headline (simulated).",
  "simulatedSource": "A plausible but fictional news source (e.g., 'Global News Wire', 'Tech Insights Daily', 'Eco Watch Journal').",
  "publicationDate": "A recent-looking date (e.g., 'October 26, 2023').",
  "fullArticleText": "The full content or a very detailed summary of the simulated article, providing comprehensive information about the news item (target 150-300 words). This text is entirely fictional for demo purposes.",
  "summary": "A 1-2 sentence concise summary of the fictional article.",
  "category": "A general category (e.g., 'Technology', 'Science', 'World News', 'Business', 'Culture', 'Environment', 'Lifestyle')."
}

Detailed Instructions:
- Generate 5-7 distinct news items.
- All fields are mandatory for each item.
- "fullArticleText" should be a detailed summary or the full content of the simulated article.
- Content should be plausible for the respective domains but clearly understood as SIMULATED.
- Ensure the entire response is ONLY the JSON array. No extra text, no markdown.

Generate news for query: "${query}"
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.7 }, 
    });

    const parsedData = parseJsonSafely<GeminiHealthcareNewsResponseItem[]>(genContentResponse.text, []) as GeminiHealthcareNewsResponseItem[];

    if (!Array.isArray(parsedData)) {
        console.error("Parsed data is not an array for news:", parsedData);
        return [];
    }

    return parsedData.map((item: Partial<GeminiHealthcareNewsResponseItem>) => ({
      id: generateId(),
      title: item.title || "Untitled News Item",
      simulatedSource: item.simulatedSource || "Unknown Source",
      publicationDate: item.publicationDate || new Date().toLocaleDateString(),
      fullArticleText: item.fullArticleText || "No detailed summary available.",
      summary: item.summary || "No summary available.",
      category: item.category || "General",
    })).filter(item => item.title !== "Untitled News Item"); 

  } catch (error) {
    console.error('Error generating news:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI News Generation Failed: ${(error as Error).message}`));
  }
};


export const analyzeIngredient = async (ingredientName: string): Promise<IngredientAnalysisResponse> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const defaultDisclaimer = "This AI-generated information on ingredients is for educational purposes ONLY and is NOT medical or dietary advice. It should NOT be used for self-diagnosis, treatment, or to guide supplementation. Always consult a qualified healthcare professional or registered dietitian before making any changes to your health regimen or diet.";

  const prompt = `
You are an AI ingredient analyst for "Validly".
Your task is to provide an informational summary for the supplement ingredient: "${ingredientName}".
The response MUST be in JSON format. Respond ONLY with a single, valid JSON object. Do not use markdown fences.

JSON Output Structure:
{
  "ingredientName": "${ingredientName}",
  "overview": "A general description of the ingredient (2-3 sentences).",
  "simulatedCommonUsesOrBenefits": [
    { "point": "e.g., May support cognitive function", "simulatedEvidenceStrength": "Enum('Strong', 'Moderate', 'Limited', 'Emerging', 'Traditional Use Only')" }
  ],
  "simulatedResearchHighlights": ["An array of 2-3 strings, key points from AI-simulated general knowledge about research."],
  "simulatedConsiderations": [
    { "aspect": "e.g., Potential Interactions", "detail": "Simulated detail about interactions." },
    { "aspect": "Typical Dosage Range (Simulated)", "detail": "A simulated general dosage range, clearly stating it's not a recommendation." }
  ],
  "criticalDisclaimer": "MUST BE: '${defaultDisclaimer}'"
}

Detailed Instructions:
- "simulatedCommonUsesOrBenefits": Provide 2-4 items. "simulatedEvidenceStrength" is optional for each.
- "simulatedResearchHighlights": Focus on general themes, not specific studies.
- "simulatedConsiderations": Include 1-2 general considerations.
- "criticalDisclaimer" MUST be exactly as provided above.
- Ensure the entire response is ONLY the JSON object.

Analyze ingredient: "${ingredientName}"
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.3 },
    });
    
    const parsedData = parseJsonSafely<GeminiIngredientAnalysisResponseItem>(genContentResponse.text, defaultDisclaimer) as GeminiIngredientAnalysisResponseItem;

    const simulatedCommonUsesOrBenefits: IngredientBenefitOrUse[] = (Array.isArray(parsedData.simulatedCommonUsesOrBenefits) ? parsedData.simulatedCommonUsesOrBenefits.filter(u => u && typeof u.point === 'string') : []) as IngredientBenefitOrUse[];
    const simulatedResearchHighlights: string[] = Array.isArray(parsedData.simulatedResearchHighlights) ? parsedData.simulatedResearchHighlights.filter(s => typeof s === 'string') : [];
    const simulatedConsiderations: IngredientConsideration[] = (Array.isArray(parsedData.simulatedConsiderations) ? parsedData.simulatedConsiderations.filter(c => c && typeof c.aspect === 'string' && typeof c.detail === 'string') : []) as IngredientConsideration[];

    return {
      ingredientName: ingredientName, 
      overview: parsedData.overview || "No overview generated by AI.",
      simulatedCommonUsesOrBenefits,
      simulatedResearchHighlights,
      simulatedConsiderations,
      criticalDisclaimer: parsedData.criticalDisclaimer || defaultDisclaimer,
    };
  } catch (error) {
    console.error('Error analyzing ingredient:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Ingredient Analysis Failed: ${(error as Error).message}`));
  }
};

export const getConsumerInsights = async (productConceptOrClaim: string, targetAudience?: string): Promise<ConsumerInsightsResponse> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const defaultDisclaimer = "These AI-generated insights are SIMULATED and for informational/brainstorming purposes ONLY. They do NOT reflect real market research or actual consumer opinions. Always conduct thorough, real-world consumer testing for accurate data.";

  const prompt = `
You are an AI consumer insights analyst for "Validly".
Your task is to analyze the provided product concept/claim and optional target audience, then generate SIMULATED consumer insights.
The response MUST be in JSON format. Respond ONLY with a single, valid JSON object. Do not use markdown fences.

Product Concept/Claim: "${productConceptOrClaim}"
Target Audience (Optional): "${targetAudience || 'General Population'}"

JSON Output Structure:
{
  "aiUnderstanding": "Brief summary of how AI understood the input product concept and audience (1-2 sentences).",
  "simulatedOverallSentiment": "Enum('Positive', 'Neutral', 'Negative', 'Mixed', 'Undetermined')",
  "simulatedPositiveKeywords": ["Array of 3-5 keywords/phrases consumers might associate positively (simulated)."],
  "simulatedNegativeKeywords": ["Array of 3-5 keywords/phrases consumers might associate negatively (simulated)."],
  "keyThemesFromSimulatedFeedback": ["Array of 2-4 broader themes from simulated consumer perspectives."],
  "potentialResonancePoints": ["Array of 2-3 aspects of the concept likely to appeal strongly (simulated)."],
  "potentialHesitationsOrConcerns": ["Array of 2-3 possible doubts or worries (simulated)."],
  "suggestedMarketingAngles": ["Array of 2-3 marketing angle ideas (simulated)."],
  "criticalDisclaimer": "MUST BE: '${defaultDisclaimer}'"
}

Detailed Instructions:
- All fields are mandatory.
- Ensure all insights are clearly framed as SIMULATED.
- If targetAudience is not provided, assume general population.
- Ensure the entire response is ONLY the JSON object.

Analyze: "${productConceptOrClaim}" for audience "${targetAudience || 'General Population'}"
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.5 },
    });
    
    const parsedData = parseJsonSafely<GeminiConsumerInsightsResponseItem>(genContentResponse.text, defaultDisclaimer) as GeminiConsumerInsightsResponseItem;

    return {
      productConceptOrClaim: productConceptOrClaim,
      targetAudience: targetAudience,
      aiUnderstanding: parsedData.aiUnderstanding || "AI could not fully process the input concept.",
      simulatedOverallSentiment: parsedData.simulatedOverallSentiment || 'Undetermined',
      simulatedPositiveKeywords: Array.isArray(parsedData.simulatedPositiveKeywords) ? parsedData.simulatedPositiveKeywords.filter(s=>typeof s === 'string') : [],
      simulatedNegativeKeywords: Array.isArray(parsedData.simulatedNegativeKeywords) ? parsedData.simulatedNegativeKeywords.filter(s=>typeof s === 'string') : [],
      keyThemesFromSimulatedFeedback: Array.isArray(parsedData.keyThemesFromSimulatedFeedback) ? parsedData.keyThemesFromSimulatedFeedback.filter(s=>typeof s === 'string') : [],
      potentialResonancePoints: Array.isArray(parsedData.potentialResonancePoints) ? parsedData.potentialResonancePoints.filter(s=>typeof s === 'string') : [],
      potentialHesitationsOrConcerns: Array.isArray(parsedData.potentialHesitationsOrConcerns) ? parsedData.potentialHesitationsOrConcerns.filter(s=>typeof s === 'string') : [],
      suggestedMarketingAngles: Array.isArray(parsedData.suggestedMarketingAngles) ? parsedData.suggestedMarketingAngles.filter(s=>typeof s === 'string') : [],
      criticalDisclaimer: parsedData.criticalDisclaimer || defaultDisclaimer,
    };
  } catch (error) {
    console.error('Error getting consumer insights:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Consumer Insights Failed: ${(error as Error).message}`));
  }
};


export const analyzeMarketingCopy = async (marketingCopy: string): Promise<ComplianceAnalysisResponse> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const defaultDisclaimer = "This AI tool provides SIMULATED compliance feedback on marketing copy for informational and brainstorming purposes ONLY. It is NOT legal or regulatory advice and does NOT guarantee compliance with any laws. Always consult qualified legal and regulatory professionals.";
  
  const prompt = `
You are an AI marketing compliance assistant for "Validly".
Your task is to analyze the provided marketing copy for SIMULATED compliance considerations relevant to wellness products.
The response MUST be in JSON format. Respond ONLY with a single, valid JSON object. Do not use markdown fences.

Marketing Copy: "${marketingCopy}"

JSON Output Structure:
{
  "aiUnderstanding": "Brief summary of how AI understood the marketing copy (1-2 sentences).",
  "simulatedPotentialComplianceFlags": [
    { 
      "flag": "e.g., Overly strong efficacy claim", 
      "simulatedSeverity": "Enum('High', 'Medium', 'Low', 'Informational')", 
      "simulatedExplanation": "Brief AI-simulated explanation of why it's flagged." 
    }
  ],
  "simulatedImprovementSuggestions": ["Array of 2-3 AI-simulated suggestions for refining the copy."],
  "generalSimulatedComplianceConsiderations": ["Array of 2-3 general AI-simulated compliance principles for wellness marketing."],
  "criticalDisclaimer": "MUST BE: '${defaultDisclaimer}'"
}

Detailed Instructions:
- "simulatedPotentialComplianceFlags": Provide 1-3 simulated flags.
- Frame all feedback as SIMULATED and for informational purposes.
- Ensure the entire response is ONLY the JSON object.

Analyze copy: "${marketingCopy}"
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.4 },
    });
    
    const parsedData = parseJsonSafely<GeminiComplianceAnalysisResponseItem>(genContentResponse.text, defaultDisclaimer) as GeminiComplianceAnalysisResponseItem;

    const simulatedPotentialComplianceFlags: SimulatedComplianceFlag[] = (Array.isArray(parsedData.simulatedPotentialComplianceFlags) ? parsedData.simulatedPotentialComplianceFlags.filter(f => f && typeof f.flag === 'string' && typeof f.simulatedSeverity === 'string' && typeof f.simulatedExplanation === 'string') : []) as SimulatedComplianceFlag[];

    return {
      analyzedCopy: marketingCopy,
      aiUnderstanding: parsedData.aiUnderstanding || "AI could not fully process the marketing copy.",
      simulatedPotentialComplianceFlags,
      simulatedImprovementSuggestions: Array.isArray(parsedData.simulatedImprovementSuggestions) ? parsedData.simulatedImprovementSuggestions.filter(s=>typeof s === 'string') : [],
      generalSimulatedComplianceConsiderations: Array.isArray(parsedData.generalSimulatedComplianceConsiderations) ? parsedData.generalSimulatedComplianceConsiderations.filter(s=>typeof s === 'string') : [],
      criticalDisclaimer: parsedData.criticalDisclaimer || defaultDisclaimer,
    };
  } catch (error) {
    console.error('Error analyzing marketing copy:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Compliance Analysis Failed: ${(error as Error).message}`));
  }
};

export const getFormulationIdeas = async (query: string, includeIngredients?: string, excludeIngredients?: string): Promise<FormulationAdvisorResponse> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const defaultDisclaimer = "These AI-generated formulation ideas are SIMULATED and for informational/brainstorming purposes ONLY. They are NOT scientifically validated or tested formulations. Developing any new product requires extensive R&D, safety testing, and regulatory compliance. Always consult with qualified scientists and experts.";

  const prompt = `
You are an AI product formulation advisor for "Validly".
Your task is to generate SIMULATED novel product formulation ideas based on the user's query and optional ingredient preferences.
The response MUST be in JSON format. Respond ONLY with a single, valid JSON object. Do not use markdown fences.

User Query: "${query}"
Include Ingredients (Optional): "${includeIngredients || 'None specified'}"
Exclude Ingredients (Optional): "${excludeIngredients || 'None specified'}"

JSON Output Structure:
{
  "aiUnderstanding": "Brief summary of how AI understood the query and ingredient preferences (1-2 sentences).",
  "simulatedFormulationIdeas": [
    {
      "ideaTitle": "Catchy name for the simulated formulation idea",
      "conceptDescription": "Brief overview of the simulated product concept",
      "keySimulatedIngredients": [
        { "ingredientName": "Simulated Ingredient 1", "simulatedRationale": "Why this is included (simulated).", "simulatedBenefit": "What it contributes (simulated)." }
      ],
      "potentialUniqueSellingPoints": ["Array of 2-3 simulated USPs."],
      "simulatedTargetConsumer": "Brief description of who this might appeal to (simulated)."
    }
  ],
  "generalSimulatedInnovationConsiderations": ["Array of 2-3 general AI-simulated points for wellness product innovation."],
  "criticalDisclaimer": "MUST BE: '${defaultDisclaimer}'"
}

Detailed Instructions:
- "simulatedFormulationIdeas": Generate 2-3 distinct ideas. Each idea should have 2-4 keySimulatedIngredients.
- Ensure all aspects are clearly marked or understood as SIMULATED.
- Ensure the entire response is ONLY the JSON object.

Formulate ideas for: "${query}", including "${includeIngredients}", excluding "${excludeIngredients}"
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.65 }, 
    });
    
    const parsedData = parseJsonSafely<GeminiFormulationAdvisorResponseItem>(genContentResponse.text, defaultDisclaimer) as GeminiFormulationAdvisorResponseItem;
    
    const simulatedFormulationIdeas: FormulationIdea[] = (Array.isArray(parsedData.simulatedFormulationIdeas) ? parsedData.simulatedFormulationIdeas.map(idea => {
        if (!idea || typeof idea.ideaTitle !== 'string' || typeof idea.conceptDescription !== 'string') return null;
        const keySimulatedIngredients: KeySimulatedIngredient[] = (Array.isArray(idea.keySimulatedIngredients) ? idea.keySimulatedIngredients.filter(ksi => ksi && typeof ksi.ingredientName === 'string' && typeof ksi.simulatedRationale === 'string') : []) as KeySimulatedIngredient[];
        return {
            ...idea,
            keySimulatedIngredients,
            potentialUniqueSellingPoints: Array.isArray(idea.potentialUniqueSellingPoints) ? idea.potentialUniqueSellingPoints.filter(s=>typeof s === 'string') : [],
        };
    }).filter(Boolean) : []) as FormulationIdea[];


    return {
      query: query,
      aiUnderstanding: parsedData.aiUnderstanding || "AI could not fully process the formulation query.",
      simulatedFormulationIdeas,
      generalSimulatedInnovationConsiderations: Array.isArray(parsedData.generalSimulatedInnovationConsiderations) ? parsedData.generalSimulatedInnovationConsiderations.filter(s=>typeof s === 'string') : [],
      criticalDisclaimer: parsedData.criticalDisclaimer || defaultDisclaimer,
    };
  } catch (error) {
    console.error('Error generating formulation ideas:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Formulation Advisor Failed: ${(error as Error).message}`));
  }
};

export const generateSimulatedForumContent = async (count: number = 5): Promise<{threads: ForumThread[], posts: ForumPost[]}> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const prompt = `
You are an AI content generator for "Validly", a wellness platform.
Your task is to create ${count} simulated forum threads, each with an initial question and 1-2 answers.
The topics should revolve around health, wellness, supplements, nutrition, and fitness.
The response MUST be a JSON array of objects. Respond ONLY with a single, valid JSON array. Do not use markdown fences.

JSON Output Structure for each item in the array:
{
  "threadTitle": "A plausible and engaging question title related to wellness/supplements. Max 100 chars.",
  "question": {
    "authorName": "SimulatedUser[RandomNumber]", 
    "authorType": "Enum('User', 'Simulated Wellness Coach')", 
    "content": "The full text of the question (2-4 sentences)."
  },
  "answers": [
    {
      "authorName": "SimulatedExpert[RandomSuffix]", 
      "authorType": "Enum('Simulated Healthcare Professional', 'Simulated Scientist', 'User', 'Simulated Wellness Coach')", 
      "content": "A helpful and plausible answer to the question (2-4 sentences). If authorType is professional, make the answer sound more knowledgeable but still general and disclaimed if necessary (though you don't add the disclaimer here)."
    }
  ],
  "tags": ["An array of 1-3 relevant lowercase tags, e.g., 'sleep', 'nutrition', 'vitamin d', 'stress']"
}

Detailed Instructions:
- Generate ${count} distinct forum thread objects.
- For "authorName", create plausible anonymous-style usernames.
- For "authorType", use a mix of the provided enum values.
- Ensure content is well-written, relevant, and sounds like real forum discussions.
- Tags should be relevant to the question.
- Make questions and answers diverse in topic and tone.
- The entire response must be ONLY the JSON array.
`;

  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.75 },
    });

    const parsedData = parseJsonSafely<GeminiForumThreadSeed[]>(genContentResponse.text, []) as GeminiForumThreadSeed[];

    if (!Array.isArray(parsedData)) {
      console.error("Parsed forum data is not an array:", parsedData);
      return { threads: [], posts: [] };
    }

    const allThreads: ForumThread[] = [];
    const allPosts: ForumPost[] = [];
    const now = Date.now();

    parsedData.forEach((seed, index) => {
      const threadId = generateId();
      const questionPostId = generateId();
      const questionTimestamp = now - (index * 60000 * 15); 

      const questionPost: ForumPost = {
        id: questionPostId,
        threadId,
        authorName: seed.question.authorName || `User${generateId().substring(0,3)}`,
        authorType: seed.question.authorType || 'User',
        content: seed.question.content,
        timestamp: questionTimestamp,
        isQuestion: true,
      };
      allPosts.push(questionPost);

      let lastActivityTimestamp = questionTimestamp;
      let replyCount = 0;

      (seed.answers || []).forEach((answerSeed, ansIndex) => {
        const answerPostId = generateId();
        const answerTimestamp = questionTimestamp + ((ansIndex + 1) * 60000 * 5); 
        lastActivityTimestamp = Math.max(lastActivityTimestamp, answerTimestamp);
        replyCount++;
        
        const answerPost: ForumPost = {
          id: answerPostId,
          threadId,
          authorName: answerSeed.authorName || `Expert${generateId().substring(0,3)}`,
          authorType: answerSeed.authorType || 'Simulated Healthcare Professional',
          content: answerSeed.content,
          timestamp: answerTimestamp,
          isQuestion: false,
        };
        allPosts.push(answerPost);
      });
      
      const thread: ForumThread = {
        id: threadId,
        title: seed.threadTitle,
        originalQuestionPostId: questionPostId,
        authorName: questionPost.authorName,
        authorType: questionPost.authorType,
        timestamp: questionPost.timestamp,
        lastActivityTimestamp,
        replyCount,
        tags: seed.tags || [],
      };
      allThreads.push(thread);
    });

    return { threads: allThreads, posts: allPosts };

  } catch (error) {
    console.error('Error generating simulated forum content:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Forum Content Generation Failed: ${(error as Error).message}`));
  }
};


// --- New Gamification Content Generation ---

export const generateQuizContent = async (
  preQuizInfo: PreQuizInfo
): Promise<GeminiQuizResponse> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const numberOfQuestions = 10; 

  const prompt = `
You are an AI quiz generator.
Your task is to create ${numberOfQuestions} VARIED quiz questions.
Each question MUST have exactly 4 multiple-choice options.
Indicate the correct answer index (0-3).
Provide a brief, helpful explanation for the correct answer.
Also, generate a suitable overall "quizTitle" for this set of questions, reflecting its tailored nature. Max 50 chars for the title.

The user has provided the following background information for tailoring the quiz:
- Field of Study: ${preQuizInfo.fieldOfStudy || 'General Knowledge'}
- Year of Study/Experience: ${preQuizInfo.yearOfStudy || 'General'}
- Stated General Knowledge Level: ${preQuizInfo.level}

Question Generation Rules:
1.  **Primary Topic Determination**:
    *   IF the "Field of Study" is specific and NOT broadly 'wellness', 'health', or 'general science' (e.g., "Engineering", "Mathematics", "History", "Literature", "Physics", "Art History", "Computer Science", "Economics", "Philosophy", etc.), THEN the quiz questions and title should PRIMARILY focus on that specified "Field of Study".
    *   ELSE (if "Field of Study" is 'General Knowledge', 'Not specified', or a wellness/health/general science topic like "Biology", "Nutrition", "Psychology"), THEN the quiz questions and title should focus on general knowledge, critical thinking, science, or broad wellness concepts appropriate for the stated level.
2.  **Content Adaptation**:
    *   Adapt the complexity, depth, and specific sub-topics of the questions based on the user's "Year of Study/Experience" (if provided and relevant to the field) and their "Stated General Knowledge Level" (${preQuizInfo.level}). For example, a "Beginner" level for "Engineering" should have foundational questions, while "Advanced" could have more complex problems or concepts. An "Advanced" level "History" quiz could ask about more nuanced interpretations or specific periods.
3.  **Variety**: Ensure the ${numberOfQuestions} questions are distinct and cover different aspects within the determined primary topic. Avoid repetition.
4.  **Quiz Title**: The "quizTitle" MUST reflect the actual content of the quiz. For example:
    *   If Field is "Mechanical Engineering", Level "Intermediate": "Intermediate Mechanical Engineering Quiz"
    *   If Field is "Mathematics", Level "Advanced": "Advanced Calculus Challenge"
    *   If Field is "General Knowledge", Level "Beginner": "Beginner General Knowledge Test"
    *   If Field is "World History", Year "2nd Year", Level "Intermediate": "Intermediate World History (Year 2 Focus)"
    *   If Field is blank, Level "Intermediate": "Intermediate General Knowledge Quiz"
5.  **Fallback**: If the "Field of Study" is extremely niche or uninterpretable for quiz generation, default to a "General Knowledge" quiz appropriate for the stated level and reflect this in the quizTitle.

The response MUST be in JSON format. Respond ONLY with a single, valid JSON object. Do not use markdown fences.

JSON Output Structure:
{
  "quizTitle": "Generated title for this personalized quiz",
  "questions": [
    {
      "question": "Example tailored question text considering user's background?",
      "options": ["Option A", "Option B", "Correct Option C", "Option D"],
      "correctAnswerIndex": 2,
      "explanation": "Brief explanation why C is correct, potentially referencing user's level if relevant."
    }
    // ... ${numberOfQuestions - 1} more distinct questions
  ]
}

Detailed Instructions:
- Generate exactly ${numberOfQuestions} distinct and varied questions.
- Generate a "quizTitle".
- Adhere strictly to the Question Generation Rules above.
- Ensure questions are relevant, clear. Options should be plausible. One correct answer per question.
- Explanations should be concise and educational.
- The entire response must be ONLY the JSON object.

Generate a personalized quiz tailored for a user with Field of Study: "${preQuizInfo.fieldOfStudy || 'General Knowledge'}", Year/Experience: "${preQuizInfo.yearOfStudy || 'General'}", Stated General Knowledge Level: "${preQuizInfo.level}".
`;

  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.6 }, // Slightly increased temperature for more varied questions 
    });

    const parsedData = parseJsonSafely<GeminiQuizResponse>(genContentResponse.text, { quizTitle: "Personalized Quiz", questions: [] }) as GeminiQuizResponse;
    
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        parsedData.questions = [];
    }
    parsedData.questions = parsedData.questions.filter(q => 
        q && typeof q.question === 'string' && 
        Array.isArray(q.options) && q.options.length === 4 && 
        typeof q.correctAnswerIndex === 'number' && q.correctAnswerIndex >=0 && q.correctAnswerIndex < 4
    ).slice(0, numberOfQuestions); 

    if (parsedData.questions.length < numberOfQuestions) {
        console.warn(`AI generated only ${parsedData.questions.length}/${numberOfQuestions} questions for the personalized quiz.`);
    }
    if (!parsedData.quizTitle) {
        parsedData.quizTitle = `Personalized Quiz (${preQuizInfo.level}, ${preQuizInfo.fieldOfStudy || 'General'})`;
    }
    
    return parsedData;

  } catch (error) {
    console.error(`Error generating personalized quiz:`, error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Personalized Quiz Generation Failed: ${(error as Error).message}`));
  }
};


export const generateSpotTheClaimChallenge = async (): Promise<GeminiSpotTheClaimResponse> => {
  if (!checkApiKey()) {
    return Promise.reject(new Error("API Error: API Key not configured."));
  }
  const defaultResponse: GeminiSpotTheClaimResponse = {
      claim: "AI could not generate a claim challenge. Please try again.",
      isDubious: true,
      explanation: "The AI failed to generate content for this challenge."
  };

  const prompt = `
You are an AI content creator for "Validly", a wellness app.
Your task is to create a "Spot the Dubious Claim" challenge.
Provide a product claim (related to health, wellness, or supplements).
Indicate if the claim is 'dubious' (likely exaggerated, misleading, or unsupported) or 'sound' (plausible, well-phrased).
Provide a brief explanation for why it's dubious or sound.
The response MUST be in JSON format. Respond ONLY with a single, valid JSON object. No markdown fences.

JSON Output Structure:
{
  "claim": "A product claim string. Make some claims subtly dubious (e.g., using words like 'cures', 'guaranteed results for all') and others more reasonable or sound.",
  "isDubious": true, // boolean: true if the claim is dubious, false if it sounds generally reasonable
  "explanation": "A brief explanation (1-2 sentences) justifying why the claim is dubious or sound, focusing on typical red flags or good practices in wellness marketing."
}

Generate one challenge.
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.6 },
    });
    
    const parsedData = parseJsonSafely<GeminiSpotTheClaimResponse>(genContentResponse.text, defaultResponse) as GeminiSpotTheClaimResponse;
    
    if (typeof parsedData.claim !== 'string' || typeof parsedData.isDubious !== 'boolean' || typeof parsedData.explanation !== 'string') {
        console.warn("Received malformed Spot The Claim challenge data, using default.");
        return defaultResponse;
    }
    return parsedData;

  } catch (error) {
    console.error('Error generating Spot the Claim challenge:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
    return Promise.reject(new Error(`AI Challenge Generation Failed: ${(error as Error).message}`));
  }
};

export const generateSimulatedLeaderboardEntries = async (count: number = 7): Promise<LeaderboardEntry[]> => {
  if (!checkApiKey()) {
    console.warn("API Key not configured for leaderboard, returning mock data.");
    return [
        { id: 'sim1', userName: "WellnessWarrior", score: 1350 },
        { id: 'sim2', userName: "HealthyHacker", score: 1120 },
        { id: 'sim3', userName: "NutriNinja", score: 980 },
        { id: 'sim4', userName: "ZenMaster", score: 750 },
        { id: 'sim5', userName: "BioExplorer", score: 600 },
        { id: 'sim6', userName: "FitGuru", score: 450 },
        { id: 'sim7', userName: "MindfulUser", score: 300 },
    ];
  }
  const prompt = `
You are an AI data generator for "Validly", a wellness app.
Your task is to create ${count} simulated user leaderboard entries.
Usernames should be creative and related to health/wellness.
Scores should range plausibly from 50 to 1500.
The response MUST be a JSON array of objects. Respond ONLY with a single, valid JSON array. Do not use markdown fences.

JSON Output Structure for each item in the array:
{
  "userName": "SimulatedWellnessUser123",
  "score": 780
}

Generate ${count} entries.
`;
  let genContentResponse: GenerateContentResponse | undefined;
  try {
    genContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.7 },
    });

    const parsedData = parseJsonSafely<GeminiLeaderboardEntrySeed[]>(genContentResponse.text, []) as GeminiLeaderboardEntrySeed[];

    if (!Array.isArray(parsedData)) {
        console.error("Parsed leaderboard data is not an array:", parsedData);
        return []; 
    }

    return parsedData.map((entry, index) => ({
        id: `sim-${index}-${generateId()}`,
        userName: entry.userName || `User${generateId().substring(0,4)}`,
        score: typeof entry.score === 'number' && entry.score >= 0 ? entry.score : Math.floor(Math.random() * 1450) + 50,
    })).sort((a,b) => b.score - a.score);

  } catch (error) {
    console.error('Error generating simulated leaderboard entries:', error);
    if (genContentResponse && genContentResponse.text) console.error("Gemini Response Text:", genContentResponse.text);
     return [
        { id: 'err_sim1', userName: "WellnessWarrior", score: 1350 },
        { id: 'err_sim2', userName: "HealthyHacker", score: 1120 },
    ];
  }
};