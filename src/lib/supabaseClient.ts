
import { createClient } from '@supabase/supabase-js'

// 使用空字符串作为默认值，防止 createClient 直接报错导致白屏
// 如果环境变量未配置，后续的网络请求会失败，但 UI 能正常渲染
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ 警告: 缺少 Supabase 环境变量，数据库功能将无法工作。请检查 .env 文件或 Vercel 设置。')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
