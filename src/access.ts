import type { Access } from 'payload'

export const hasRole = (...roles: string[]): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    return roles.includes(user.role as string)
  }
}

export const publicRead: Access = () => true

export const authenticatedRead: Access = ({ req: { user } }) => Boolean(user)

export const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return (user.role as string) === 'admin'
}

export const editorOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'editor'].includes(user.role as string)
}

export const contributorOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'editor', 'contributor'].includes(user.role as string)
}

// Un admin peut tout modifier ; les autres ne peuvent éditer que leur propre compte.
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if ((user.role as string) === 'admin') return true
  return { id: { equals: user.id } }
}
