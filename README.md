# RecycleHub

RecycleHub is a Single Page Application (SPA) built with Angular that connects individuals with authorized collectors for recycling services.

## Tech Stack

- Angular 17+
- NgRx (for Collections feature)
- RxJS
- Tailwind CSS
- JSON Server (Backend Mock)
- Lucide Icons

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HMZElidrissi/recyclehub.git
cd recyclehub
```

2. Install dependencies:
```bash
npm install
```

3. Start the JSON Server (mock backend):
```bash
npm run server
```

4. Start the Angular development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

### Development Setup

1. Run JSON Server with the mock database:
```bash
json-server --watch db.json
```

2. Default Users:
- Collector: collector@recycleapp.com / password123
- Particular: user@recycleapp.com / password123

## Project Structure

```
├── app/
│   ├── core/          # Core modules, services, and interfaces
│   ├── features/      # Feature (auth, collection)
│   ├── shared/        # Shared components and utilities
│   └── store/         # NgRx store (collections feature)
```

## Key Features

### Authentication
- User registration with profile picture upload
- Login with role-based redirection
- Session management

### Collection Management
- Create, view, update, and delete collection requests
- Weight estimation and validation
- Multiple waste type selection
- Status tracking
- Points calculation based on waste type and weight

### Points System
- Automatic points attribution:
  - Plastic: 2 points/kg
  - Glass: 1 point/kg
  - Paper: 1 point/kg
  - Metal: 5 points/kg
