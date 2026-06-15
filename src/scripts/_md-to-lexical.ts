/* eslint-disable @typescript-eslint/no-explicit-any */
// Convertisseur Markdown → Lexical maison, fiable et sans dépendance.
// Gère : titres (## / ###), paragraphes, gras (**…**), listes (- …).
// Les liens markdown [texte](url) sont réduits à leur texte (sécurité : pas de nœud lien fragile).

const txt = (text: string, bold = false) => ({
  detail: 0,
  format: bold ? 1 : 0,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
})

const inline = (s: string) => {
  const clean = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  return clean
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((p) => {
      const b = p.startsWith('**') && p.endsWith('**')
      return txt(b ? p.slice(2, -2) : p, b)
    })
}

const heading = (tag: string, s: string) => ({
  children: inline(s),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'heading',
  version: 1,
  tag,
})

const paragraph = (s: string) => ({
  children: inline(s),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'paragraph',
  version: 1,
  textFormat: 0,
  textStyle: '',
})

const list = (items: string[]) => ({
  children: items.map((it, i) => ({
    children: inline(it),
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'listitem',
    version: 1,
    value: i + 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'list',
  version: 1,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
})

export const toLexical = (md: string) => {
  const children: any[] = []
  let listBuf: string[] = []
  const flush = () => {
    if (listBuf.length) {
      children.push(list(listBuf))
      listBuf = []
    }
  }
  for (const raw of md.split('\n')) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    if (line.startsWith('### ')) {
      flush()
      children.push(heading('h3', line.slice(4)))
    } else if (line.startsWith('## ')) {
      flush()
      children.push(heading('h2', line.slice(3)))
    } else if (line.startsWith('- ')) {
      listBuf.push(line.slice(2))
    } else {
      flush()
      children.push(paragraph(line))
    }
  }
  flush()
  return { root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
}
