import React, { useState } from 'react';
import { useRoomSync } from '../hooks/useRoomSync';
import { getCatJudgeVerdict } from '../lib/geminiClient';
import { Cat, Gavel, Loader2, Share2, LogOut } from 'lucide-react';
import clsx from 'clsx';

interface RoomPageProps {
  roomId: string;
  nickname: string;
  role: 'male' | 'female';
  onLeave: () => void;
}

export const RoomPage: React.FC<RoomPageProps> = ({ roomId, nickname, role, onLeave }) => {
  const { loading, roomData, updateMale, updateFemale } = useRoomSync(roomId, role);
  const [analyzing, setAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setVerdict(null);
    try {
      const result = await getCatJudgeVerdict(roomData);
      setVerdict(result);
    } catch (err) {
      alert('猫猫法官连接失败，请检查网络或 Key 喵！');
    } finally {
      setAnalyzing(false);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('房间号已复制，快发给TA吧！');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">正在布置法庭现场...</p>
        </div>
      </div>
    );
  }

  // Determine readOnly status based on role
  const isMale = role === 'male';
  const isFemale = role === 'female';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Cat className="w-8 h-8 text-brand-500" />
          <h1 className="text-xl font-bold text-gray-800 hidden md:block">猫猫法庭</h1>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-100 px-4 py-1.5 rounded-full">
          <span className="text-sm font-mono text-gray-600">ID: {roomId}</span>
          <button onClick={copyRoomId} className="p-1 hover:bg-white rounded-full transition-colors">
            <Share2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {isMale ? '👦' : '👧'} {nickname}
          </span>
          <button 
            onClick={onLeave}
            className="text-sm text-red-400 hover:text-red-600 font-medium"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          
          {/* Male Column */}
          <div className={clsx(
            "flex flex-col gap-4 rounded-2xl p-4 md:p-6 transition-all border-2",
            isMale ? "bg-blue-50 border-blue-200 shadow-md" : "bg-white border-gray-100 opacity-90"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👦</span>
              <h2 className="font-bold text-gray-700">男方陈述</h2>
              {isMale && <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">你的回合</span>}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-500">发生了什么事？</label>
              <textarea
                value={roomData.male_story}
                onChange={(e) => updateMale(e.target.value, roomData.male_feelings)}
                readOnly={!isMale}
                placeholder={isMale ? "请客观描述事情经过..." : "等待对方填写..."}
                className={clsx(
                  "w-full h-32 md:h-48 p-3 rounded-xl border resize-none focus:outline-none transition-shadow",
                  isMale ? "border-blue-200 focus:ring-2 focus:ring-blue-300" : "bg-gray-50 border-gray-100 text-gray-500"
                )}
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-500">心里怎么想的？</label>
              <textarea
                value={roomData.male_feelings}
                onChange={(e) => updateMale(roomData.male_story, e.target.value)}
                readOnly={!isMale}
                placeholder={isMale ? "觉得哪里被误解了？有什么委屈？" : "等待对方填写..."}
                className={clsx(
                  "w-full h-24 md:h-32 p-3 rounded-xl border resize-none focus:outline-none transition-shadow",
                  isMale ? "border-blue-200 focus:ring-2 focus:ring-blue-300" : "bg-gray-50 border-gray-100 text-gray-500"
                )}
              />
            </div>
          </div>

          {/* Female Column */}
          <div className={clsx(
            "flex flex-col gap-4 rounded-2xl p-4 md:p-6 transition-all border-2",
            isFemale ? "bg-pink-50 border-pink-200 shadow-md" : "bg-white border-gray-100 opacity-90"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👧</span>
              <h2 className="font-bold text-gray-700">女方陈述</h2>
              {isFemale && <span className="ml-auto text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">你的回合</span>}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-500">发生了什么事？</label>
              <textarea
                value={roomData.female_story}
                onChange={(e) => updateFemale(e.target.value, roomData.female_feelings)}
                readOnly={!isFemale}
                placeholder={isFemale ? "请客观描述事情经过..." : "等待对方填写..."}
                className={clsx(
                  "w-full h-32 md:h-48 p-3 rounded-xl border resize-none focus:outline-none transition-shadow",
                  isFemale ? "border-pink-200 focus:ring-2 focus:ring-pink-300" : "bg-gray-50 border-gray-100 text-gray-500"
                )}
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-500">心里怎么想的？</label>
              <textarea
                value={roomData.female_feelings}
                onChange={(e) => updateFemale(roomData.female_story, e.target.value)}
                readOnly={!isFemale}
                placeholder={isFemale ? "觉得哪里被误解了？有什么委屈？" : "等待对方填写..."}
                className={clsx(
                  "w-full h-24 md:h-32 p-3 rounded-xl border resize-none focus:outline-none transition-shadow",
                  isFemale ? "border-pink-200 focus:ring-2 focus:ring-pink-300" : "bg-gray-50 border-gray-100 text-gray-500"
                )}
              />
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-brand-500 font-lg rounded-full shadow-lg hover:bg-brand-600 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                猫猫法官思考中...
              </>
            ) : (
              <>
                <Gavel className="w-5 h-5 mr-2" />
                请猫猫法官来评判 🐱⚖️
              </>
            )}
          </button>
        </div>

        {/* Verdict Result */}
        {verdict && (
          <div className="animate-fade-in-up bg-white rounded-3xl p-8 border-4 border-brand-100 shadow-xl mb-12">
             <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
               <div className="bg-brand-100 p-3 rounded-full">
                 <Cat className="w-8 h-8 text-brand-600" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800">法官的裁决书</h3>
             </div>
             <div className="prose prose-stone max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
               {verdict}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};