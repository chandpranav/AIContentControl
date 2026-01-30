# 🤖 AIContentControl

**AI-Powered Content Moderation Made Simple**

![Status](https://img.shields.io/badge/status-active-success.svg)

---

## 🎯 What Does This Do?

AIContentControl is an intelligent content moderation system that uses OpenAI's powerful AI models to automatically analyze and moderate content in real-time. Whether you're managing user-generated content, filtering messages, or ensuring content quality, this tool makes it simple and effective.

### ✨ Key Features

- 🧠 **Smart AI Analysis** - Leverages OpenAI's advanced models for accurate content moderation
- ⚡ **Real-Time Processing** - Get instant results with lightning-fast analysis
- 🎯 **Easy Setup** - Docker-ready deployment in minutes
- 🔒 **Secure** - Your API key stays private and secure
- 🎨 **Modern UI** - Clean, intuitive interface built with React

---

## 🚀 Quick Start (Super Simple!)

### Prerequisites

You only need two things:
1. **Docker** installed on your computer ([Get Docker](https://www.docker.com/get-started))
2. **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Setup in 3 Steps

#### Step 1️⃣: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key and copy it

#### Step 2️⃣: Clone & Configure

```bash
# Clone the repository
git clone https://github.com/chandpranav/AIContentControl.git
cd AIContentControl

# Create your .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

**Important:** Replace `your_api_key_here` with your actual OpenAI API key!

#### Step 3️⃣: Run with Docker

```bash
docker-compose up
```

That's it! 🎉

Open your browser and go to: **http://localhost**

---

## 🎮 How to Use

1. **Access the App** - Open http://localhost in your browser
2. **Input Content** - Enter or paste the content you want to moderate
3. **Get Results** - Receive instant AI-powered analysis
4. **Take Action** - Use the insights to moderate your content

---

## 🛑 Stopping the Application

To stop the application, press `Ctrl + C` in the terminal, then run:

```bash
docker-compose down
```

---

## 🔧 Troubleshooting

### Port Already in Use?

If you get a port conflict error:

```bash
docker-compose down
# Change the port in docker-compose.yml if needed
docker-compose up
```

### Need to Rebuild?

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### API Key Not Working?

- Make sure your `.env` file is in the root directory
- Check that there are no extra spaces in your API key
- Verify your OpenAI API key is active and has credits

---

## 📂 Project Structure

```
AIContentControl/
├── backend/           # Node.js backend server
├── src/              # React frontend
├── docker-compose.yml # Docker configuration
├── .env              # Your API key (create this!)
└── README.md         # You are here
```

---

## 💡 Tips

- **Keep your API key secret!** Never commit your `.env` file to GitHub
- Monitor your OpenAI usage at [OpenAI Platform](https://platform.openai.com/usage)
- Check out the logs if something goes wrong: `docker-compose logs`

---

## 🤝 Contributing

Found a bug or want to add a feature? Feel free to:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is part of a Final Year Project.

---

## 👨‍💻 Author

**Pranav Chand**
- GitHub: [@chandpranav](https://github.com/chandpranav)

---

## ⭐ Show Your Support

If you find this project helpful, give it a ⭐ on GitHub!

---

## 📞 Need Help?

Open an issue on GitHub if you run into any problems or have questions!

---

**Made with ❤️ for smarter content moderation**
