import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(".", { dotfiles: "ignore" }));

app.get("/config", (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  });
});

app.post("/create-checkout", async (req, res) => {
  const { product, frontendOrigin } = req.body;
  const appUrl = frontendOrigin || "http://localhost:3000";

  const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
    },
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: [
            {
              name: product.name,
              amount: product.price,
              currency: "PHP",
              quantity: 1,
            },
          ],
          payment_method_types: ["card", "gcash", "paymaya"],
          success_url: `${appUrl}/success.html`,
          cancel_url: `${appUrl}/index.html`,
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json(data);
  }

  res.json(data);
});

app.listen(3000, () => {
  console.log("Payment server running on http://localhost:3000");
});