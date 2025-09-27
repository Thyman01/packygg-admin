# PackyGG Admin Dashboard

A clean and modern admin dashboard built with Next.js, shadcn/ui, and Supabase for managing PackyGG card sets.

## Features

- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark/Light Mode**: Toggle between light and dark themes
- 📊 **Dashboard Overview**: Statistics and recent activity
- 📦 **Sets Management**: Full CRUD operations for card sets
- 🔍 **Search & Filter**: Easy navigation and data management
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd packygg-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up Supabase database**
   
   Create a table called `sets` with the following schema:
   ```sql
   CREATE TABLE sets (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     set_name TEXT NOT NULL,
     card_amount INTEGER NOT NULL,
     release_date TEXT NOT NULL,
     logo_url TEXT,
     background_url TEXT,
     series TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
packygg-admin/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── analytics/         # Analytics page
│   │   ├── sets/              # Sets management page
│   │   ├── users/             # User management page
│   │   ├── settings/          # Settings page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard home page
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── add-set-form.tsx   # Form for adding new sets
│   │   ├── dashboard-layout.tsx # Main dashboard layout
│   │   ├── edit-set-form.tsx  # Form for editing sets
│   │   ├── header.tsx         # Dashboard header
│   │   ├── sets-table.tsx     # Sets data table
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   ├── theme-provider.tsx # Theme context provider
│   │   └── theme-toggle.tsx   # Theme toggle component
│   └── lib/
│       ├── supabase.ts        # Supabase client and types
│       └── utils.ts           # Utility functions
├── components.json            # shadcn/ui configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies and scripts
```

## Usage

### Dashboard
- View overview statistics and recent activity
- Quick access to common tasks

### Sets Management
- **View Sets**: Browse all sets in a clean table format
- **Add Set**: Create new sets with form validation
- **Edit Set**: Update existing set information
- **Delete Set**: Remove sets with confirmation
- **View Details**: See detailed information about each set

### Navigation
- Use the sidebar to navigate between different sections
- Toggle between light and dark themes using the theme toggle
- Search functionality in the header

## Database Schema

The `sets` table includes the following fields:

- `id`: Unique identifier (UUID)
- `set_name`: Name of the card set
- `card_amount`: Number of cards in the set
- `release_date`: Release date of the set
- `logo_url`: URL to the set's logo image
- `background_url`: URL to the set's background image
- `series`: Series name the set belongs to
- `created_at`: Timestamp when the record was created

## Customization

### Adding New Pages
1. Create a new directory in `src/app/`
2. Add a `page.tsx` file with your component
3. Update the navigation in `src/components/sidebar.tsx`

### Styling
- Modify `src/app/globals.css` for global styles
- Use Tailwind CSS classes for component styling
- Customize the theme in `tailwind.config.js`

### Components
- All UI components are in `src/components/ui/`
- Create new components in `src/components/`
- Follow the existing patterns for consistency

## Deployment

### Vercel (Recommended) 🚀

Your project is now **Vercel-ready** with optimized configuration! 

**Quick Deploy:**
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

**Detailed Instructions:**
See [DEPLOYMENT.md](./DEPLOYMENT.md) for a comprehensive deployment guide.

**What's Included:**
- ✅ `vercel.json` configuration
- ✅ Optimized `next.config.ts` for Vercel
- ✅ Environment variables template (`env.example`)
- ✅ Security headers and performance optimizations
- ✅ Automatic deployments from GitHub

### Other Platforms
- Build the project: `npm run build`
- Start production server: `npm start`
- Ensure environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.