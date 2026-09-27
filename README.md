# Breakthrough Interactive

An experimental Breakthrough landing experience built around a tactile particle sculpture.

## Interaction

- Move the cursor through the particle form to disturb it.
- Particles use spring physics to return to their home positions.
- Click/touch and drag to rotate the complete three-dimensional form.
- The sculpture slowly moves while idle.
- Reduced-motion preferences disable the ambient movement and particle disturbance.
- Responsive particle counts keep the experience practical on smaller devices.

The sculpture is intentionally not a copy of OpenAI's artwork. Its form represents the Breakthrough idea: a constrained, tangled lower state gradually opening into a wider field of possibility.

## Run locally

Because this is dependency-free HTML/CSS/JavaScript, serve the folder with any static web server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Files

- `index.html` — page structure and Breakthrough copy
- `styles.css` — responsive editorial design system
- `app.js` — canvas particle renderer, interaction and spring physics
