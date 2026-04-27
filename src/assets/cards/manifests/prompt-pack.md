# AI Image Generation Prompt Pack

## Generation Instructions

This document contains the locked prompt templates and guidelines for generating all 40 card face images for the memory game.

### Technical Specifications

- **Output Format**: PNG
- **Master Resolution**: 1024x1024 pixels (square, 1:1 aspect ratio)
- **Optimized Resolution**: 512x512 pixels (for app use)
- **Background**: Plain light neutral background (white, light gray, or cream)
- **Subject Positioning**: Centered, ~70% frame height
- **Style**: Child-friendly cartoon illustration

### Generation Workflow

1. For each subject in the locked subject list, generate 4 candidate images
2. Use the exact positive prompt template with [SUBJECT] variable substitution
3. Apply the exact negative prompt to all generations
4. Keep random seed metadata for reproducibility
5. Score each candidate against the acceptance checklist (see below)
6. Select the candidate with perfect 10/10 score
7. If no candidate passes, regenerate 4 new candidates
8. Export selected image at 1024x1024, then optimize to 512x512
9. Save with canonical filename: `{category}_{subject}.png`
10. Record metadata in assets.json

---

## Locked Prompt Templates

### Positive Prompt Template (Exact)

```
Create a child-friendly cartoon card image of a single [SUBJECT] in side-view or 3/4 view, centered, with full silhouette visible, expressive simple shapes, and consistent style with a modern mobile memory game. Keep background plain light neutral. No additional objects, no scenery, no words.
```

**Style Prefix (apply to all)**: child-friendly cartoon illustration, clean bold outlines, soft shading, bright but balanced colors, centered single subject, no text, no logos, no watermark, no border, plain light neutral background, high readability at small size.

### Negative Prompt Template (Exact)

```
text, letters, numbers, logo, watermark, frame, border, multiple subjects, cluttered background, photorealistic style, dark horror style, blur, low resolution, cropped subject, cut-off silhouette
```

---

## Locked Subject List (40 Total)

### Animals (20)

1. lion
2. tiger
3. elephant
4. giraffe
5. zebra
6. panda
7. koala
8. monkey
9. fox
10. rabbit
11. bear
12. deer
13. wolf
14. penguin
15. dolphin
16. whale
17. turtle
18. crocodile
19. owl
20. parrot

### Vehicles (20)

1. car
2. bus
3. truck
4. motorcycle
5. bicycle
6. train
7. tram
8. helicopter
9. airplane
10. rocket
11. boat
12. ship
13. submarine
14. ambulance
15. fire truck
16. police car
17. tractor
18. bulldozer
19. scooter
20. hot air balloon

---

## Acceptance Checklist (Pass/Fail - All Required)

Score each candidate image 0 or 1 on these criteria. **Only 10/10 passes.**

1. ✅ **Identity Clarity**: Independent reviewer names the subject correctly within 2 seconds
2. ✅ **Category Clarity**: Reviewer correctly tags animal or vehicle with no hesitation
3. ✅ **Single-Subject Rule**: Exactly one primary object visible
4. ✅ **Silhouette Completeness**: No clipping at edges
5. ✅ **Style Consistency**: Line weight, shading, and background match the pack
6. ✅ **Legibility at Card Size**: Still identifiable when rendered at 96x96 pixels
7. ✅ **No Forbidden Artifacts**: No text, logos, watermark, or border
8. ✅ **Distinctiveness**: Not visually confusable with any existing accepted card
9. ✅ **Technical Quality**: Minimum 512x512 optimized output, no heavy compression artifacts
10. ✅ **Naming and Metadata Compliance**: Filename and manifest fields exactly match ID schema

---

## Example Prompts

### Example: Lion (Animal)

**Full Positive Prompt**:

```
child-friendly cartoon illustration, clean bold outlines, soft shading, bright but balanced colors, centered single subject, no text, no logos, no watermark, no border, plain light neutral background, high readability at small size. Create a child-friendly cartoon card image of a single lion in side-view or 3/4 view, centered, with full silhouette visible, expressive simple shapes, and consistent style with a modern mobile memory game. Keep background plain light neutral. No additional objects, no scenery, no words.
```

**Negative Prompt**:

```
text, letters, numbers, logo, watermark, frame, border, multiple subjects, cluttered background, photorealistic style, dark horror style, blur, low resolution, cropped subject, cut-off silhouette
```

**Expected Output**: `animals_lion.png` (512x512)

### Example: Fire Truck (Vehicle)

**Full Positive Prompt**:

```
child-friendly cartoon illustration, clean bold outlines, soft shading, bright but balanced colors, centered single subject, no text, no logos, no watermark, no border, plain light neutral background, high readability at small size. Create a child-friendly cartoon card image of a single fire truck in side-view or 3/4 view, centered, with full silhouette visible, expressive simple shapes, and consistent style with a modern mobile memory game. Keep background plain light neutral. No additional objects, no scenery, no words.
```

**Negative Prompt**:

```
text, letters, numbers, logo, watermark, frame, border, multiple subjects, cluttered background, photorealistic style, dark horror style, blur, low resolution, cropped subject, cut-off silhouette
```

**Expected Output**: `vehicles_firetruck.png` (512x512)

---

## Metadata Tracking

For each accepted image, record the following in `assets.json`:

```json
{
  "id": "pairId",
  "category": "animal|vehicle",
  "subject": "subject name",
  "imageKey": "category_subject",
  "fileName": "category_subject.png",
  "promptUsed": "full positive prompt text",
  "negativePrompt": "full negative prompt text",
  "seed": 12345,
  "generationDate": "2026-04-27",
  "model": "model name/version",
  "reviewerInitials": "XX",
  "checklistScore": 10,
  "altText": "Subject Name"
}
```

---

## Generation Tools

Recommended AI image generation tools:

- Stable Diffusion (SDXL or SD 1.5)
- Midjourney
- DALL-E 3
- Leonardo.ai

Use consistent model and settings across all 40 images to ensure style consistency.
