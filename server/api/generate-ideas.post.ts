import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { hobby } = body

  if (!hobby) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hobby/interest is required'
    })
  }

  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured'
    })
  }

  const openai = new OpenAI({
    apiKey
  })

  try {
    const prompt = `Based on the hobby/interest "${hobby}", generate 8-12 potential business ideas or job opportunities. 
    
    Format each idea as:
    [Number]. [Job Title/Business Idea] - Description: [2-3 sentence description explaining how this relates to the hobby and how to monetize it]
    
    Focus on practical, achievable ideas that someone could start as a side business or freelance opportunity.
    Be specific and actionable in your descriptions.
    
    Example format:
    1. Romance Novel Review Blogger - Description: Start a blog reviewing romance novels and monetize through affiliate links to bookstores, sponsored content from publishers, and ad revenue. You could also create video reviews for YouTube or TikTok to expand your audience.`

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a creative business consultant helping people turn their hobbies into profitable ventures. Provide practical, specific business ideas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    })

    return {
      success: true,
      ideas: completion.choices[0].message.content
    }
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to generate ideas'
    })
  }
})