// NRJKA Digital - config mise à jour avec collections personnalisées
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { s3Storage } from '@payloadcms/storage-s3'

import { Expertises } from './collections/Expertises'
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { CaseStudySectors } from './collections/CaseStudySectors'
import { CaseStudyTypes } from './collections/CaseStudyTypes'
import { Products } from './collections/Products'
import { ContactMessages } from './collections/ContactMessages'
import { Reviews } from './collections/Reviews'
import { Testimonials } from './collections/Testimonials'
import { JobOffers } from './collections/JobOffers'
import { JobApplications } from './collections/JobApplications'
import { Appointments } from './collections/Appointments'
import { BlogComments } from './collections/BlogComments'
import { Resources } from './collections/Resources'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getServerSideURL(),
  admin: {
    meta: {
      titleSuffix: '· NRJKA',
      icons: [
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
      ],
    },
    components: {
      // Identité NRJKA (remplace le logo Payload sur la connexion et dans la nav).
      graphics: {
        Icon: '@/components/admin/BrandLogo#Icon',
        Logo: '@/components/admin/BrandLogo#Logo',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // Traduction désormais déclenchée par collection (bouton dans chaque vue liste),
      // plus de panneau « tout le site » sur le dashboard.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // push désactivé : init rapide, plus de « pulling schema » lent, seeds (via route) fiables.
    // La base contient déjà tout le schéma (synchronisé en mode push).
    // ⚠️ Avant la mise en ligne : créer une migration propre (#6) — Netlify ne peut pas tourner en push.
    // Pour ajouter un champ d'ici là : repasser push:true le temps de la synchro, puis push:false.
    push: false,
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Expertises,
    Services,
    CaseStudies,
    CaseStudySectors,
    CaseStudyTypes,
    Products,
    ContactMessages,
    Reviews,
    Testimonials,
    JobOffers,
    JobApplications,
    Appointments,
    BlogComments,
    Resources,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
  globals: [Header, Footer, SiteSettings],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
