# OpenAI API Setup Guide for SideBling

## Getting Your OpenAI API Key

1. **Create an OpenAI Account**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account

2. **Navigate to API Keys**
   - Once logged in, click on your profile icon (top right)
   - Select "API keys" from the dropdown menu
   - Or go directly to: https://platform.openai.com/api-keys

3. **Create a New API Key**
   - Click "Create new secret key"
   - Give your key a descriptive name (e.g., "SideBling Development")
   - Copy the key immediately (you won't be able to see it again!)

4. **Add Billing Information** (Required for API usage)
   - Go to Settings → Billing
   - Add a payment method
   - Set usage limits to control spending

## Setting Up Your API Key in SideBling

1. **Create a `.env` file** in the root directory of the project:
   ```bash
   cp .env.example .env
   ```

2. **Add your API key** to the `.env` file:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Replace `sk-proj-xxxxx...` with your actual API key

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

## Available OpenAI Models

You can use different models by setting the `OPENAI_MODEL` environment variable in your `.env` file:

```
OPENAI_MODEL=gpt-4o
```

Available models include:

- **GPT-4o** (`gpt-4o`) - Default, latest multimodal model, fast and efficient
- **GPT-4o mini** (`gpt-4o-mini`) - Smaller, faster, more affordable
- **GPT-3.5 Turbo** (`gpt-3.5-turbo`) - Fast and cost-effective
- **o1-preview** (`o1-preview`) - Advanced reasoning model (slower, more expensive)
- **o1-mini** (`o1-mini`) - Smaller reasoning model

For the latest models including o3 or o4, check [OpenAI's model documentation](https://platform.openai.com/docs/models) for availability and exact model names.

## Security Notes

- **Never commit your `.env` file** to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secret and rotate it regularly
- Set usage limits in your OpenAI account to prevent unexpected charges

## Testing Your Setup

1. Enter a hobby in the text field (e.g., "I like reading romance novels")
2. Click "Show me the money" button
3. The app will generate 8-12 business ideas based on your input

## Troubleshooting

- **"OpenAI API key not configured"**: Make sure you've created the `.env` file and added your key
- **API errors**: Check your OpenAI account for:
  - Valid payment method
  - Available credits
  - API key permissions
- **Rate limits**: OpenAI has rate limits; wait a moment between requests if you hit them

## Monitoring Usage

Track your API usage and costs at: https://platform.openai.com/usage