import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

export async function getRecipeFromMistral(ingredientsArr) {
     try {
        const res = await fetch("https://recipe-app-backend-gdni.onrender.com/api/recipe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ingredients: ingredientsArr })
        });

        const data = await res.json();
        return data.recipe;
    } catch (err) {
        console.error("Error fetching recipe:", err);
        return "Sorry, failed to fetch a recipe.";
    }
}

