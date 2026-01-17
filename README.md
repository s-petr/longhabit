![License](https://img.shields.io/badge/license-MIT-green)

<a href="https://longhabit.com"><img src="https://longhabit.com/og-image.png" /></a>



# Long Habit

Long Habit is a simple CRUD application for tracking long-term habits and recurring tasks. It is a production-ready full-stack project built using PocketBase and React. This is a comprehensive example of integrating PocketBase into a larger Go project and combining it with a modern React frontend using best practices. The application is very simple and can be used as a template for starting new projects. Most of the boilerplate setup has been taken care of and common issues have been identified and fixed.

Try the live version: https://longhabit.com

## Key Features

### Backend Architecture
- Running the latest version of Pocketbase (v0.36).
- Single-binary build. Uses Go's "embed" package to embed the React front-end as a file system inside the compiled binary.
- PocketBase is installed as a Go package and used as a framework. The project makes use of many extension features including:
  - Custom hooks and middleware
  - Route binding
  - Database operations
  - Scheduled tasks with cron
  - HTML email templates
  - Custom logging configuration
- Worker pool implementation for bulk email processing done using the Pond library
- Idiomatic Go code organization with clean separation of concerns

### Frontend Implementation
- Modern React setup with TypeScript and Vite.
- Built for React 19. Works with React Compiler enabled.
- TailwindCSS with ShadCN UI fully configured with a custom theme.
- Responsive design using all the best practices. Supports light and dark mode. Tested on desktop and mobile screens.
- Complete authentication flow with customized forms. Works with email + password auth as well as Google OAuth.
- TanStack Router configured using best practices. All the authentication logic and data fetching happens in the router before the pages are loaded. Dynamic page title switching based on route.
- TanStack Query fully integrated with PocketBase and TanStack Router. Fresh data is fetched from the backend and loaded before the routes are rendered. TanStack Query takes care of data fetching and ensures that client-side state is up to date with server-side data.
- Loading states are implemented using the new React Suspense boundaries. 
- Dynamic forms with validation and error messages implemented using React Hook Form and Zod.
- SEO optimizations like meta description and social media cards meta tags added to root HTML page, sitemap.xml and robots.txt added and configured. Exclude rule for the PocketBase admin "/_" URL added to prevent it from being indexed by crawlers.

### Developer Experience
- Vite dev mode with hot reload works seamlessly with PocketBase. No need to wait for PocketBase to compile. Vite and PocketBase proxy requests to and from each other while running on different ports.
- Fully working ESlint configuration written in the new ESlint 9 format. Includes all the relevant plugins for React, Tailwind and Prettier. 
- Single-command production builds.
- Run project locally in Docker Compose without additional configuration.
- Compatible with any Node.js runtime (default: Bun).

### Deployment
- Compile into a single executable binary or deploy using Docker containers.
- Fully containerized, all the build steps happen in a multi-stage Dockerfile. Outputs a slim Alpine container that contains only the compiled binary.
- Docker Compose deployment that works out of the box. Working health check endpoint included.
- Ready for deployment on Dokploy, Coolify and similar platforms.

## Tech Stack

- **Frontend**
  - [TypeScript](https://www.typescriptlang.org/docs/) - Frontend language
  - [React 19](https://react.dev/blog/2024/04/25/react-19) - Frontend framework
  - [Vite](https://vite.dev/guide/) - Build tool
  - [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview) - Router
  - [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) - Data fetching and state management
  - [TanStack Table](https://tanstack.com/table/latest/docs/introduction) - Table / data grid library
  - [React Hook Form](https://www.react-hook-form.com/api/) - Forms library for React
  - [shadcn/ui](https://ui.shadcn.com/docs) - React component library based on TailwindCSS and Radix UI
  - [TailwindCSS](https://tailwindcss.com/docs/installation) - Utility-first CSS framework
  - [Zod](https://zod.dev/?id=table-of-contents) - Typescript schema validation
  - [Date-fns](https://date-fns.org/docs/Getting-Started) - Date manipulation library
- **Backend**
  - [Go](https://go.dev/doc/) - Backend language
  - [PocketBase](https://pocketbase.io/docs/) - Backend framework
  - [Pond](https://github.com/alitto/pond) - Worker pool implementation in Go
- **Deployment**
  - [Docker](https://docs.docker.com/reference/) - Containerization tool
  - [Dokploy](https://dokploy.com) - Open source hosting platform

## Getting Started

### Prerequisites
- Go 1.25+
- Node.js 24+ or Bun 1.3+
- Docker (optional)

### Installation

- Clone the repository `git clone https://github.com/s-petr/longhabit`
- Install dependencies `npm install` or `bun install`.
- Create a new superuser (admin) account for the Pocketbase admin dashboard. First compile the binary `npm run build` or `bun run build`. Then run the command `./longhabit superuser upsert {{admin email}} {{admin password}}`
- Once the PocketBase backend is up and running you need to set up the database tables. Log in to the Pocketbase dashboard `http://localhost:8090/_/` using your superuser credentials. Go to Settings -> Import collections -> Load from JSON file. Select file [backend/pb_schema.json](backend/pb_schema.json) and import it.
- In order for the "Sign in with Google" button to work you need to register with Google Cloud and get Google OAuth 2.0 API credentials (you can follow this [guide](https://support.google.com/googleapi/answer/6158849?hl=en)). After you get the credentials, go to the Pocketbase dashboard Collections -> Users -> Edit collection -> OAuth2 -> Add provider -> Google. Enter your Client ID and Client Secret and save.
- A folder `/db` will be created in the root directory. This will contain the database files. Docker Compose has been configured with a volume to read/write data to the same folder. You may need to adjust file permissions for this folder if PocketBase cannot write to it from the Docker container.

### Local Development

- Start development servers `npm run dev` or `bun run dev`
 
### Production Build

- Build frontend and backend `npm run build` or `bun run build`
- Run the compiled binary `npm run preview` or `bun run preview`

### Docker Deployment
- Build and run with Docker Compose `npm run compose` or `bun run compose`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.