import React, { useState } from 'react';
import { Cat, HeartHandshake, User } from 'lucide-react';

interface LandingPageProps {
  onJoin: (roomId: string, nickname: string, role: 'male' | 'female') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<'male' | 'female' | null>(null);

  const generateRoomId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomId(result);
  };

  const handleJoin = () => {
    if (!roomId.trim() || !nickname.trim() || !role) {
      alert('请把信息填写完整喵！🐾');
      return;
    }
    onJoin(roomId.trim().toUpperCase(), nickname.trim(), role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-brand-500 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Cat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">🐱 猫猫法庭</h1>
          <p className="text-brand-100">情侣吵架调解所</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Room ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">房间号</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="输入或生成房间号"
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2.5 outline-none"
              />
              <button
                onClick={generateRoomId}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                随机生成
              </button>
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">你的昵称</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="怎么称呼你？"
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-2.5 outline-none"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">你的角色</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRole('male')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  role === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-200 text-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">👦</div>
                <span className="font-medium">我是男方</span>
              </button>
              <button
                onClick={() => setRole('female')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  role === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-pink-200 text-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">👧</div>
                <span className="font-medium">我是女方</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleJoin}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors gap-2"
          >
            <HeartHandshake className="w-5 h-5" />
            进入猫猫法庭 🐾
          </button>
        </div>
      </div>
    </div>
  );
};