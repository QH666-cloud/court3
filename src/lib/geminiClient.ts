
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Log key status on load (masked for security)
if (!API_KEY) {
  console.error('❌ Critical: VITE_GEMINI_API_KEY is not defined in import.meta.env');
} else {
  console.log(`✅ Gemini API Key detected (Length: ${API_KEY.length})`);
}

interface JudgeInput {
  male_story: string;
  male_feelings: string;
  female_story: string;
  female_feelings: string;
}

export const getCatJudgeVerdict = async (data: JudgeInput) => {
  if (!API_KEY) {
    console.error('Attempted to call Gemini API without a valid key.');
    throw new Error('GEMINI_KEY_MISSING');
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `
    你现在是温柔但严格的“猫猫法官”，要帮一对情侣解决矛盾。
    
    【案件档案】
    👦 男方陈述：
    - 事情经过：${data.male_story || '（沉默）'}
    - 委屈与感受：${data.male_feelings || '（沉默）'}
    
    👧 女方陈述：
    - 事情经过：${data.female_story || '（沉默）'}
    - 委屈与感受：${data.female_feelings || '（沉默）'}
    
    请你以第三人称“猫猫法官”的口吻，输出一段 Markdown 格式的判决书。
    要求：
    1.  **🐱 法官总结**：用中立、可爱但一针见血的语气，总结双方的核心矛盾点。
    2.  **🔍 深度分析**：
        - 指出男方做得不对或忽略对方感受的地方。
        - 指出女方做得不对或忽略对方感受的地方。
    3.  **⚖️ 最终裁决**：给出一个温柔但有边界感的结论（比如“男方罚扣一个小鱼干 / 双方都要被摸头”等），并明确责任分配（如“双方各打五十大板”或“某方责任略大”）。
    4.  **💡 沟通处方**：给出 3 条具体、可操作的建议，帮助他们现在立刻缓解气氛。
    
    语气风格：既要有法官的威严，又要带点猫咪的傲娇和治愈感。
    `;

    console.log('📡 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini response received.');
    return text;
  } catch (error) {
    console.error('❌ Gemini API Request Failed:', error);
    // Throw the raw error so the component can inspect it
    throw error;
  }
};
