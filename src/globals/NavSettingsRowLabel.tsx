'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const NavSettingsRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<{ entity?: string }>()
  const n = rowNumber !== undefined ? rowNumber + 1 : ''
  const entity = data?.entity
  return <div>{entity ? `${n}. ${entity}` : `Entrée ${n}`}</div>
}
