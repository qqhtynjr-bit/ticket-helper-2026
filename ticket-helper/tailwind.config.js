/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === 马卡龙浅色主题（不再是深色 KTV 风） ===
        'bg-cream': '#FFF9F4',          // 奶油米白（主背景）
        'bg-soft': '#FDF2F5',           // 樱花柔粉（次背景）
        'bg-card': '#FFFFFF',           // 纯白卡片
        'bg-card-hover': '#FFF6FB',     // 卡片悬停微粉
        
        // 马卡龙 6 色：低饱和、柔和、清新
        'macaron-pink': '#F4A5B8',      // 樱花粉（主强调）
        'macaron-purple': '#B8A9E0',    // 香芋紫
        'macaron-blue': '#9FC5E8',      // 天空蓝
        'macaron-green': '#A8D5BA',     // 薄荷绿
        'macaron-yellow': '#F6E3A3',    // 柠檬黄
        'macaron-orange': '#F7C59F',    // 蜜桃橙
        'macaron-rose': '#F8C8DC',      // 玫瑰粉（次强调）
        
        // 文字：马卡龙风柔和深色调，不是强对比黑白
        'text-primary': '#4A4A5C',      // 暖豆沙紫灰（主文字）
        'text-secondary': '#7E7E91',    // 雾灰（次文字）
        'text-muted': '#A8A8B8',        // 柔灰（辅助文字）
        
        // 边框/分割线：极浅柔色
        'border-soft': '#EADFE8',       // 粉灰线
        'border-lighter': '#F2E8EE',    // 更浅粉灰线
        
        // === 兼容旧别名，减少修改面积 ===
        'accent-pink': '#F4A5B8',
        'accent-purple': '#B8A9E0',
        'accent-blue': '#9FC5E8',
        'accent-cyan': '#8FD3D8',
        'accent-yellow': '#F6E3A3',
        'accent-green': '#A8D5BA',
        'accent-orange': '#F7C59F',
        'bg-dark': '#FFF9F4',
        'bg-dark-2': '#FDF2F5',
      },
      fontFamily: {
        sans: ['Inter', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'macaron': '0 8px 30px -12px rgba(244, 165, 184, 0.25)',
        'macaron-lg': '0 20px 60px -20px rgba(184, 169, 224, 0.35)',
        'card-soft': '0 2px 14px -2px rgba(180, 150, 190, 0.12)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulseFast 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'gradient-soft': 'gradientSoft 6s ease infinite',
        'bounce-slow': 'bounceSlow 2.4s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        pulseFast: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        gradientSoft: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      }
    },
  },
  plugins: [],
}
