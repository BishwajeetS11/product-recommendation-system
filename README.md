🛍️ Smart Shop – AI-Powered Product Recommendation System

Live link: https://smart-shop-eight-rho.vercel.app/

Smart Shop is a modern React-based AI product recommendation system that helps users discover products based on natural language preferences such as:

“phone under $700”

“gaming laptop”

“Apple products”

It uses Google Gemini API to intelligently filter products from a predefined catalog while enforcing strict validation rules for accurate recommendations.

🚀 Features

🔍 Natural Language Search using AI

🤖 Google Gemini (2.5 Flash) Integration

✅ Strict Query Validation (prevents vague or random searches)

🧠 AI-Based Product Matching

💻 Fully Client-Side React App

🎨 Modern UI with Tailwind CSS

📦 Lucide Icons for Clean Design

⚡ Fast & Lightweight (Vite)

🧱 Tech Stack
Technology	Purpose
React	UI Framework
Vite	Development & Build Tool
Tailwind CSS	Styling
Google Gemini API	AI Recommendations
Lucide React	Icons
JavaScript (ES6+)	Logic
📂 Project Structure
src/
├── assets/
├── App.css
├── App.jsx
├── index.css
├── main.jsx
│
.env
index.html

🔑 Environment Variables

Create a .env file in the root directory:

VITE_GEMINI_API_KEY=your_gemini_api_key_here


⚠️ Important:
Never commit your .env file. Add it to .gitignore.

🛠️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/BishwajeetS11/product-recommendation-system.git
cd product-recommendation-system

2️⃣ Install Dependencies
npm install

3️⃣ Add Environment Variable

Create .env file and add:

VITE_GEMINI_API_KEY=YOUR_API_KEY

4️⃣ Run the App
npm run dev


Open in browser:

http://localhost:5173

🧠 How It Works

User enters a search query (e.g. “gaming laptop”)

Input is validated on the client:

Minimum length

No random or meaningless strings

Product catalog is sent to Gemini API

AI returns only matching product IDs

Results are filtered and displayed

📏 AI Matching Rules

The AI strictly follows these rules:

✔ Match exact category & brand

✔ Respect price ranges

✔ Match features from descriptions

❌ Ignore vague or incomplete queries

❌ Return empty results if nothing matches

Example queries:

Query	Result
la	❌ Invalid
laptop	✅ All laptops
phone under $700	✅ Matching phones
gaming laptop	✅ Gaming laptops only
🎨 UI Highlights

Gradient background

Responsive grid layout

Loading & error states

Smart suggestions

Clean card-based design

📸 Screenshots (Optional)

Add screenshots here for better presentation.

🔒 Security Notes

API key is stored in .env

No sensitive data is logged

AI responses are sanitized before parsing

📌 Future Improvements

🛒 Cart & Checkout

🔐 User Authentication

📊 Analytics

💾 Backend Integration

🔍 Advanced Filtering UI

🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your branch
3. Commit changes
4. Open a Pull Request

📄 License

This project is licensed under the MIT License.

🙌 Acknowledgements

Google Gemini API

Lucide Icons

Tailwind CSS

React & Vite Community

⭐ If you like this project, give it a star!

Happy Coding 🚀
