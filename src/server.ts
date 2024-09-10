import "dotenv/config"
import app from "./app";

const port = process.env.PORT_API || 3333;
app.listen(port, () => console.log(`Server running or port ${port}`));