import { CameraOption, Option } from '../types';

export const subjects: Option[] = [
  { id: 'sub-cyber-girl', zh: '霓虹賽博女孩', en: 'cyberpunk girl' },
  { id: 'sub-detective', zh: '老派偵探', en: 'noir detective' },
  { id: 'sub-astronaut', zh: '月面太空人', en: 'astronaut on the moon' },
  { id: 'sub-dancer', zh: '現代舞者', en: 'contemporary dancer' },
  { id: 'sub-android', zh: '仿生人', en: 'android being' }
];

export const actions: Option[] = [
  { id: 'act-walk-slow', zh: '緩慢步行', en: 'slowly walking' },
  { id: 'act-look-back', zh: '回頭凝視', en: 'looking back' },
  { id: 'act-reach-out', zh: '伸手觸碰光線', en: 'reaching toward neon light' },
  { id: 'act-hover', zh: '懸浮旋轉', en: 'hovering and rotating' },
  { id: 'act-run', zh: '疾步前進', en: 'briskly moving forward' }
];

export const environments: Option[] = [
  { id: 'env-neon-alley', zh: '霓虹雨夜巷弄', en: 'neon alley in the rain' },
  { id: 'env-smoky-alley', zh: '煙霧瀰漫的巷道', en: 'smoky narrow alley' },
  { id: 'env-moon', zh: '月球表面', en: 'lunar surface' },
  { id: 'env-lab', zh: '未來實驗室', en: 'futuristic lab' },
  { id: 'env-forest', zh: '薄霧森林空地', en: 'misty forest clearing' }
];

export const styleOptions: Option[] = [
  { id: 'style-cinematic', zh: '電影質感', en: 'cinematic' },
  { id: 'style-ultra', zh: '超寫實', en: 'ultra realistic' },
  { id: 'style-film-grain', zh: '膠片顆粒', en: 'film grain' },
  { id: 'style-shallow', zh: '淺景深', en: 'shallow depth of field' },
  { id: 'style-4k', zh: '4K 級解析', en: '4k resolution' },
  { id: 'style-soft-glow', zh: '柔光氛圍', en: 'soft glow ambience' },
  { id: 'style-high-contrast', zh: '高對比', en: 'high contrast lighting' }
];

export const defaultStylePreset = ['style-cinematic', 'style-ultra', 'style-shallow', 'style-4k'];

const beginner = 'Beginner';
const intermediate = 'Intermediate';
const advanced = 'Advanced';

export const cameraOptions: CameraOption[] = [
  { id: 'cam-01', zh: '自然輕微運鏡', en: 'subtle natural movement', level: beginner, tags: ['穩定', '入門'] },
  { id: 'cam-02', zh: '推進 / Dolly-in', en: 'push-in / dolly-in', level: beginner, tags: ['聚焦'] },
  { id: 'cam-03', zh: '拉遠 / Dolly-out', en: 'pull-out / dolly-out', level: beginner, tags: ['退場'] },
  { id: 'cam-04', zh: '追焦鏡頭（低 / 高 / 側向）', en: 'tracking shot (low / high / side)', level: intermediate, tags: ['動態'] },
  { id: 'cam-05', zh: 'Over-the-shoulder', en: 'over-the-shoulder shot', level: beginner, tags: ['敘事'] },
  { id: 'cam-06', zh: '向上 tilt up', en: 'tilt up', level: beginner, tags: ['仰視'] },
  { id: 'cam-07', zh: '向下 tilt down', en: 'tilt down', level: beginner, tags: ['俯視'] },
  { id: 'cam-08', zh: '360 度環繞', en: '360° orbit shot', level: intermediate, tags: ['沉浸'] },
  { id: 'cam-09', zh: '鳥瞰 top-down', en: "top-down bird's-eye shot", level: intermediate, tags: ['俯瞰'] },
  { id: 'cam-10', zh: '平移滑軌', en: 'smooth lateral slider movement', level: beginner, tags: ['滑軌'] },
  { id: 'cam-11', zh: '子彈時間環繞', en: 'bullet-time circular motion', level: advanced, tags: ['戲劇性'] },
  { id: 'cam-12', zh: '手持追逐', en: 'handheld chasing motion', level: intermediate, tags: ['手持'] },
  { id: 'cam-13', zh: 'Crash zoom-in', en: 'crash zoom-in', level: intermediate, tags: ['衝擊'] },
  { id: 'cam-14', zh: 'Crash zoom-out', en: 'crash zoom-out', level: intermediate, tags: ['衝擊'] },
  { id: 'cam-15', zh: '穿越玻璃 / 水霧', en: 'passthrough (glass / mist / water)', level: advanced, tags: ['創意'] },
  { id: 'cam-16', zh: '穿越髮絲 & 前翻', en: 'hair passthrough + flip to front', level: advanced, tags: ['動態'] },
  { id: 'cam-17', zh: '無人機升空環繞', en: 'drone lift-off ascending orbit', level: advanced, tags: ['空拍'] },
  { id: 'cam-18', zh: '180° 滾轉 + 後退', en: '180° roll + backward move', level: advanced, tags: ['翻轉'] },
  { id: 'cam-19', zh: '速度漸變多重運鏡', en: 'speed-ramped multi-motion transition', level: advanced, tags: ['轉場'] },
  { id: 'cam-20', zh: '長鏡頭 (dolly+orbit+rise+push-in)', en: 'long single take (dolly + orbit + rise + push-in)', level: advanced, tags: ['長鏡頭'] }
];
