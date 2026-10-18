SETUP ON VERCEL
1. Upload this folder to a GitHub repo (or run "vercel" in this folder) and import it in Vercel.
2. In the Vercel project: Storage -> Marketplace -> add "Upstash Redis" (free plan). Connect it to this project.
3. Settings -> Environment Variables -> add EDIT_PASSWORD = (the password you want for editing).
4. Redeploy. Open the site: it starts with your Excel data. Tap Edit to change anything.
