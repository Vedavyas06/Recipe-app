require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');


const app = express();
app.use(cors());
app.use(express.json());
const hf = new HfInference(process.env.HF_API_KEY);

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. 
You don't need to use every ingredient they mention in your recipe. 
The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. 
Format your response in markdown to make it easier to render to a web page.
`;

app.post('/api/recipe', async (req, res) => {
    const { ingredients } = req.body;

    try {
        const result = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredients.join(", ")}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        });

        res.json({ recipe: result.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
