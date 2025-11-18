# Deploy Mecenas Totes to Vercel (FREE) - 5 Simple Steps

## What You'll Get
A beautiful live website showcasing your artists and tote bags at `your-name.vercel.app` - completely FREE!

Note: This is a display/catalog version. Shopping cart and checkout require paid hosting (you can add later when ready).

---

## Step 1: Create a GitHub Account (5 minutes)

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Choose a username (e.g., "mecenastotes")
4. Use your email and create a password
5. Verify your email

Why? Vercel needs to connect to your code via GitHub.

---

## Step 2: Upload Your Code to GitHub

### Option A: Use GitHub's Web Interface (Easier)
1. Go to [github.com/new](https://github.com/new)
2. Name your repository: `mecenas-totes-website`
3. Make it Public
4. Click "creating a new file"
5. You'll need to copy your code files - **I'll prepare a ZIP file for you below**

### Option B: Use Replit's Git Integration (If Available)
1. Look for Git/Version Control in your Replit workspace
2. Push to GitHub

**Don't worry if this seems confusing - I recommend Option C below!**

---

## Step 3: THE EASIEST WAY - Use Vercel CLI

Actually, there's an even EASIER method that doesn't need GitHub:

### Install Vercel CLI in your Replit terminal:
```bash
npm install -g vercel
```

### Deploy directly:
```bash
vercel
```

Follow the prompts:
- "Set up and deploy?" → Yes
- "Which scope?" → Your account
- "Link to existing project?" → No
- "What's your project name?" → mecenas-totes
- "In which directory is your code?" → ./
- Want to modify settings? → No

Vercel will build and deploy your site automatically!

---

## Step 4: Alternative - Export and Upload to Netlify

If Vercel doesn't work, try Netlify's drag-and-drop:

1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Click "Add new site" → "Deploy manually"
4. Drag and drop your `dist/public` folder after building

To build your site:
```bash
npm run build
```

This creates the `dist/public` folder with your website.

---

## Step 5: Share Your Live Site!

Once deployed, you'll get a URL like:
- `mecenas-totes.vercel.app` or
- `mecenas-totes.netlify.app`

Share it on your Instagram (@mecenas.totes) and with friends!

---

## Important Notes

### What Works on the Free Site:
✅ Beautiful homepage
✅ All artist profiles with photos
✅ All tote bag designs
✅ Full product catalog
✅ Mobile-responsive design
✅ Professional look

### What Doesn't Work (Requires Backend):
❌ Shopping cart
❌ Checkout/payments
❌ User accounts
❌ Newsletter signup

**Solution**: For now, people can contact you via Instagram or email to purchase! When you're 18 or have parent help, you can upgrade to add shopping features.

---

## Need Help?

If you get stuck:
1. The error messages usually tell you what's wrong
2. Vercel/Netlify have great documentation
3. Both platforms have free support forums
4. Come back and ask me!

---

## Cost Breakdown

| What | Cost |
|------|------|
| Vercel hosting | **FREE** |
| Netlify hosting | **FREE** |
| Custom domain (optional) | ~$12/year |
| Adding shopping later | ~$20/month |

For now, stick with the free `.vercel.app` or `.netlify.app` domain!
