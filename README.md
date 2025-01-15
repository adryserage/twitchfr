![TwitchFr](https://scontent-yyz1-1.xx.fbcdn.net/v/t1.18169-9/22448269_130573191025691_3493153791436301784_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=e3f864&_nc_ohc=_ryBAmAJ99EAX-fPH0O&_nc_ht=scontent-yyz1-1.xx&oh=a62656e9e089c4c85bc034b6166ff102&oe=61CBECCD)

# TwitchFr

:collision: Groupe consacré à la communauté francophone de streameurs sur Twitch.tv. <br>
:tada: L'objectif : rassembler la communauté de streameur et vieweur francophone sur Twitch ainsi que d'aider les streameurs francais à se trouver un auditoire

***English version***

:collision: Group dedicated to the French-speaking community of streamers on Twitch.tv. <br>
:tada: The goal : to bring together the French-speaking streamer and viewer community on Twitch as well as to help French streamers find an audience

## Social
`Facebook` : facebook.com/TwitchFrOfficiel ✔️ <br>
:speech_balloon: `Discord` : discord.gg/YNu7dna ✔️ <br>
:arrow_forward: `App` : twitchfr.glideapp.io ✔️ <br>
:zzz: `Web` : en construction/ in construction 🚧
<<<<<<< HEAD

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## What Does TwitchFr Do?

TwitchFr is a comprehensive platform designed to serve the French-speaking Twitch community with the following features:

### For Viewers

- Discover French-speaking streamers based on interests and categories
- Real-time notifications for live streams from favorite creators
- Interactive chat integration with Twitch
- Personalized content recommendations
- Community event calendar

### For Streamers

- Analytics dashboard for stream performance
- Community growth tools and insights
- Networking opportunities with other French-speaking creators
- Promotional tools for upcoming streams
- Resource hub for streaming best practices

### Community Features on Facebook

- Forums for discussion and collaboration
- Event organization tools
- Content creation resources
- Mentorship programs
- Community challenges and events

## Development Guidelines

### Overview

TwitchFr is built with modern web development best practices, focusing on performance, accessibility, and user experience. This project follows strict development guidelines to ensure high-quality, maintainable code.

### Key Technical Specifications

- **Framework**: Next.js
- **Deployment**: Vercel
- **Performance Targets**:
  - First Contentful Paint (FCP) < 1.5s
  - Time to Interactive (TTI) < 3.5s
  - Core Web Vitals compliant

### Design Principles

- Mobile-first responsive design
- Component-based architecture
- Class-based styling for consistency
- Semantic HTML for accessibility
- WCAG 2.1 AA compliance

### Development Standards

- Test-driven development
- CI/CD implementation
- Cross-browser compatibility (latest 2 versions)
- PWA capabilities
- Security best practices

### Quality Assurance

- Automated testing (>80% coverage)
- Accessibility compliance
- Performance monitoring
- Regular security audits

### Authentication and API Setup

To run the application locally, you'll need to set up the following:

1. **Twitch API Credentials**
   - Create a Twitch Developer Account
   - Register your application to get:
     - `TWITCH_CLIENT_ID`
     - `TWITCH_CLIENT_SECRET`

2. **Environment Variables**
   Create a `.env.local` file in the root directory with:
   ```env
   TWITCH_CLIENT_ID=your_client_id
   TWITCH_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

3. **Authentication Flow**
   - The app uses NextAuth.js for authentication
   - Ensure you're logged in before accessing protected features
   - Token refresh is handled automatically

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
>>>>>>> parent of 072a27d (init)
