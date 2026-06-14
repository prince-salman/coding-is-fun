import type { Chapter } from '../types'
import { HTML_TRACK } from './html'
import { CSS_TRACK } from './css'
import { JS_TRACK } from './javascript'

export const CURRICULUM: Chapter[] = [...HTML_TRACK, ...CSS_TRACK, ...JS_TRACK]

export const TOTAL_MODULES = CURRICULUM.reduce(
  (sum, chapter) => sum + chapter.modules.length,
  0,
)
