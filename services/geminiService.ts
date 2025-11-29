import { GoogleGenAI, Type } from "@google/genai";
import { BirthDetails, ChartAnalysis } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

const systemInstruction = `
你是一位精通西方占星术（热带黄道带，普拉西德宫位制）的大师级占星家。
你的目标是根据出生数据计算大致的行星位置，并提供准确、富有同理心和深刻的见解。
侧重于心理占星学和进化占星学的概念。
请使用简体中文进行回复。
`;

export const generateChartData = async (details: BirthDetails): Promise<ChartAnalysis> => {
  const prompt = `
    请为以下出生信息计算本命盘：
    姓名: ${details.name}
    日期: ${details.date}
    时间: ${details.time}
    地点: ${details.location}

    请尽你所能扮演星历表引擎的角色。
    返回严格遵循此模式的有效 JSON 对象。不要包含 markdown 代码块。
    所有的文本描述字段（summary, overview）必须使用简体中文。
    行星名称请使用中文（如：太阳，月亮）。
    星座字段（sign）必须保持英文 Enum 格式以便于程序处理。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          planets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "行星的中文名称 (例如: 太阳, 月亮, 水星, 金星, 火星, 木星, 土星, 天王星, 海王星, 冥王星, 上升点, 中天)" },
                sign: { type: Type.STRING, enum: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"] },
                degree: { type: Type.NUMBER, description: "星座内的度数 (0-29.99)" },
                house: { type: Type.NUMBER, description: "宫位 (1-12)" },
                isRetrograde: { type: Type.BOOLEAN }
              },
              required: ["name", "sign", "degree", "house", "isRetrograde"]
            }
          },
          bigThree: {
            type: Type.OBJECT,
            properties: {
              sun: { 
                type: Type.OBJECT, 
                properties: { sign: { type: Type.STRING }, summary: { type: Type.STRING, description: "中文简短总结" } } 
              },
              moon: { 
                type: Type.OBJECT, 
                properties: { sign: { type: Type.STRING }, summary: { type: Type.STRING, description: "中文简短总结" } } 
              },
              rising: { 
                type: Type.OBJECT, 
                properties: { sign: { type: Type.STRING }, summary: { type: Type.STRING, description: "中文简短总结" } } 
              }
            }
          },
          overview: { type: Type.STRING, description: "两段关于性格的综合概述，使用中文。" },
          elementalBalance: {
             type: Type.OBJECT,
             properties: {
                fire: { type: Type.NUMBER, description: "百分比 0-100" },
                earth: { type: Type.NUMBER, description: "百分比 0-100" },
                air: { type: Type.NUMBER, description: "百分比 0-100" },
                water: { type: Type.NUMBER, description: "百分比 0-100" }
             }
          }
        },
        required: ["planets", "bigThree", "overview", "elementalBalance"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("未能从神谕处接收到数据。");
  }

  try {
    return JSON.parse(text) as ChartAnalysis;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("星辰今日有些模糊，请重试。");
  }
};

export const chatWithAstrologer = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  chartContext: ChartAnalysis
): Promise<string> => {
  const chartSummary = `
    上下文 - 当前星盘数据:
    太阳: ${chartContext.bigThree.sun.sign}, 月亮: ${chartContext.bigThree.moon.sign}, 上升: ${chartContext.bigThree.rising.sign}.
    概述: ${chartContext.overview}
  `;

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemInstruction + "\n" + chartSummary,
    },
    history: history,
  });

  const result = await chat.sendMessage({ message });
  return result.text || "我正在冥想你的问题...";
};