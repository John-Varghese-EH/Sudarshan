
# Sudarshan: AI-Powered Cybersecurity Awareness Platform

Sudarshan is a modern, AI-enhanced web application designed to promote cybersecurity awareness and education. It provides users with interactive tools to understand encryption, analyze potential threats, and learn about security best practices in a hands-on manner. The platform is built with a focus on security, performance, and user experience, leveraging a powerful stack that includes Next.js, Google's Genkit, and Firebase.

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5149f12-9d33-4f36-92f7-82a1335955b0/deploy-status)](https://app.netlify.com/sites/sudarshan-app/deploys)

## ✨ Live Demo

Experience the live application here: [**sudarshan-app.netlify.app**](https://sudarshan-app.netlify.app/)

## 🚀 Key Features

- **AI-Powered Threat Analysis**: Users can submit messages, emails, or other text to an AI model that analyzes it for potential security threats, such as phishing, scams, or malicious intent.
- **End-to-End Encrypted Chat**: A real-time chat application demonstrating symmetric end-to-end encryption using AES. Messages are encrypted on the client-side, stored as ciphertext in Firestore, and decrypted only by the recipient.
- **Interactive Encryption Demo**: A hands-on tool that allows users to encrypt and decrypt messages using a shared secret key, providing a clear visualization of how symmetric encryption works.
- **Educational Resources**: A dedicated page with articles and resources on various cybersecurity topics.
- **Modern, Responsive UI**: A sleek and intuitive user interface built with ShadCN UI and Tailwind CSS, ensuring a great experience on all devices.
- **User Authentication**: Secure user sign-up and sign-in functionality.

## 🛠️ Technology Stack

This project is built with a modern, robust, and scalable technology stack:

- **Framework**: [**Next.js**](https://nextjs.org/) (with React and TypeScript) - For a high-performance, server-rendered React application.
- **Generative AI**: [**Google's Genkit**](https://firebase.google.com/docs/genkit) - An open-source framework for building production-ready, AI-powered features and flows.
- **UI Components**: [**ShadCN UI**](https://ui.shadcn.com/) - A collection of beautifully designed, accessible, and composable components.
- **Styling**: [**Tailwind CSS**](https://tailwindcss.com/) - A utility-first CSS framework for rapid and consistent UI development.
- **Database**: [**Firestore**](https://firebase.google.com/docs/firestore) - A flexible, scalable NoSQL cloud database for the real-time chat and other application data.
- **Hosting**: Deployed on [**Netlify**](https://www.netlify.com/) for continuous integration, global scale, and reliability.
- **Encryption**: [**crypto-js**](https://github.com/brix/crypto-js) - For implementing AES client-side encryption.

## ⚙️ Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sudarshan.git
cd sudarshan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add your Firebase and Genkit API keys. You can get these from the Firebase console and Google AI Studio.

```.env.local
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Genkit (Google AI) API Key
GOOGLE_API_KEY=your_google_ai_api_key
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## 📂 Project Structure

```
/src
|-- app/
|   |-- (auth)/         # Authentication routes (sign-in, sign-up)
|   |-- api/            # API routes, including the AI threat analysis endpoint
|   |-- chat/           # Real-time encrypted chat page
|   |-- encryption/     # Interactive encryption demo page
|   |-- learn/          # Educational articles page
|   |-- page.tsx        # Main dashboard/landing page
|   `-- layout.tsx      # Root layout
|-- ai/
|   |-- flows/          # Genkit AI flows (e.g., analyze-threat-message.ts)
|   `-- genkit.ts       # Genkit configuration
|-- components/
|   |-- dashboard/      # Components specific to the dashboard
|   |-- ui/             # Reusable UI components from ShadCN
|   `-- shared/         # Components shared across multiple pages
|-- firebase/         # Firebase configuration and initialization
|-- styles/           # Global styles and Tailwind CSS configuration
`-- utils/            # Utility functions (e.g., encryption)
```

## 🔒 End-to-End Encryption Model

The application demonstrates end-to-end encryption using the **AES (Advanced Encryption Standard)** algorithm. This is a form of **symmetric encryption**, meaning the same secret key is used to both encrypt and decrypt data.

Here’s how it works in the **Chat Demo**:

1.  **Client-Side Encryption**: Before a message is sent, it is encrypted in the user's browser using a shared secret key with the `crypto-js` library.
2.  **Ciphertext Transmission**: Only the encrypted, unreadable text (ciphertext) is sent over the network and stored in the Firestore database. The server never sees or stores the plaintext message.
3.  **Client-Side Decryption**: When the recipient receives the message, their browser uses the same shared secret key to decrypt the ciphertext back into readable plaintext.

This model ensures that the conversation remains private and secure. The **Encryption Demo** page provides a live, hands-on tool to explore this process interactively.

## 🚀 Deployment

This application is deployed on [**Netlify**](https://www.netlify.com/). The site is automatically rebuilt and deployed whenever new changes are pushed to the `main` branch.

## 🙌 How to Contribute

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
