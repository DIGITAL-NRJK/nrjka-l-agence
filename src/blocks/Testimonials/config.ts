import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonialsBlock',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Témoignages',
    plural: 'Témoignages',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: { description: "Nombre de témoignages à afficher (triés par « Ordre d'affichage »)." },
    },
  ],
}
