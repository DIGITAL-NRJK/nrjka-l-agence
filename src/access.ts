import type { Access } from 'payload'

// Vérifie si l'utilisateur a un des rôles autorisés
export const hasRole = (...roles: string[]): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    return roles.includes(user.role)
  }
}

// Tout le monde peut lire (contenu public)
export const publicRead: Access = () => true

// Seuls les utilisateurs connectés peuvent lire
export const authenticatedRead: Access = ({ req: { user } }) => Boolean(user)

// Admin uniquement
export const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'admin'
}

// Admin et éditeurs
export const editorOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'editor'].includes(user.role)
}

// Admin, éditeurs et contributeurs
export const contributorOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return ['admin', 'editor', 'contributor'].includes(user.role)
}
