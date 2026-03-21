# MyWallet

A personal finance tracker app built with React Native and Supabase. Track your income, expenses, and manage loans all in one place.

## Features

- 📊 **Transaction Tracking** – Log income and expenses with categories
- 💰 **Loan Management** – Track money you borrowed or lent to others
- 🔐 **Secure Authentication** – Email/password and Google sign-in via Supabase


## Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Supabase (Auth + Database)
- **Navigation**: Expo Router
- **UI**: React Native Paper
- **State Management**: React Context

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mywallet.git
cd mywallet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the development server:
```bash
npx expo start
```

### Database Setup

Run the migration in `supabase/migrations/20260320000000_initial_schema.sql` in your Supabase SQL Editor.

## Project Structure

```
app/                    # Expo Router pages
  (auth)/              # Authentication screens
  (app)/               # Main app screens
src/
  context/             # React Context providers
  services/            # Supabase and API services
  components/         # Reusable UI components
  types/               # TypeScript definitions
```


you can directly downloasd the apk file from the drive.
https://drive.google.com/drive/folders/1Dv6FmMPPlJ3hkZm6S1rbvM2i6AWgU1mF
