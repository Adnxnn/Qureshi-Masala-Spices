import { Leaf, Heart, Sparkles } from 'lucide-react'
import styles from './Editorial.module.css'
export default function HeritageGraphic({ heritage = false }: { heritage?: boolean }) {
  return <div className={styles.blendGraphic} aria-label={heritage ? 'Recipes, craft and shared meals connect generations' : 'Ingredients, craft and care come together in every blend'}>
    <div className={styles.graphicOrbit} aria-hidden="true"><i /><i /><i /><Leaf size={58} strokeWidth={1} /></div>
    <p>{heritage ? 'Passed down.' : 'Thoughtfully blended.'}<br /><em>{heritage ? 'Made your own.' : 'Made to be shared.'}</em></p>
    <div className={styles.graphicLabels}><span><Leaf size={16} />{heritage ? 'Recipes' : 'Ingredients'}</span><span><Sparkles size={16} />Craft</span><span><Heart size={16} />{heritage ? 'Connection' : 'Care'}</span></div>
  </div>
}
