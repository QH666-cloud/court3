
import { GoogleGenerativeAI } from '@google/generative-ai';

// ⚠️ 严格使用 Vite 环境变量标准
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 初始化时立即检查 Key 状态
console.log('------------------------------------------------');
console.log('🔍 [GeminiClient] Initializing...');
if (!API_KEY) {
  console.error('❌ [GeminiClient] Critical Error: VITE_GEMINI_API_KEY is undefined/empty!');
  console.error('👉 Tip: Ensure you have set "VITE_GEMINI_API_KEY" in your Vercel Project Settings (Environment Variables).');
} else {
  // 安全地打印前几个字符用于确认
  console.log(`✅ [GeminiClient] API Key loaded. Starts with: ${API_KEY.substring(0, 4)}... (Length: ${API_KEY.length})`);
}
console.log('------------------------------------------------');

interface JudgeInput {
  male_story: string;
  male_feelings: string;
  female_story: string;
  female_feelings: string;
}

export const getCatJudgeVerdict = async (data: JudgeInput) => {
  // 运行时再次检查
  if (!API_KEY) {
    console.error('❌ [GeminiClient] Aborting request: Missing API Key.');
    throw new Error('GEMINI_KEY_MISSING');
  }

  // 使用最新官方 SDK 初始化
  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    // 使用 flash 模型，速度快且足够处理文本
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

    console.log('📡 [GeminiClient] Sending request to Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ [GeminiClient] Response received successfully.');
    return text;

  } catch (error: any) {
    // 打印完整的错误对象到控制台，方便在 Vercel/浏览器 调试
    console.error('❌ [GeminiClient] API Request Failed. Full Error Object:', error);
    
    if (error.response) {
       console.error('❌ [GeminiClient] Error Response Details:', error.response);
    }
    
    // 将错误向外抛出，交给 UI 层处理
    throw error;
  }
};
