export interface WardrobeItem {
  palette: string;
  underwear: string[];
  casual: string[];
  official: string[];
  gala: string[];
  swimwear: string[];
}

export const WARDROBE_DATA: Record<string, WardrobeItem> = {
  miranda: {
    palette: 'Pale Blue, Deep Sapphire, Teal, Platinum Silver, Pearl White',
    underwear: ['Sapphire Blue Silk Bralette', 'Sapphire Blue Silk Panties', 'Teal Lace Boyshorts', 'Pearl White Seamless Camisole'],
    casual: ['Sapphire Linen Button-down', 'White Raw-silk Wide-leg Trousers', 'Teal Knit Wrap Cardigan'],
    official: ['Crisp Sapphire Blazer', 'Matching Trousers', 'Pearl Silk Camisole', 'Platinum Silver Brooch'],
    gala: ['Floor-length Highslit Sapphire Satin Gown', 'Silver Geometric Trim', 'Platinum Choker'],
    swimwear: ['Teal Active One-piece Swimsuit', 'Asymmetrical Sapphire Pareo']
  },
  annelies: {
    palette: 'Emerald Green, Sage, Amber, Bronze, Warm Cream',
    underwear: ['Amber Lace Bralette', 'Sage Green Comfy Cotton Briefs', 'Warm Cream Seamless Crop Top'],
    casual: ['Cream Oversized Slouchy Knit Sweater', 'Sage Green Linen Utility Pants', 'Bronze Feather Pendant'],
    official: ['Emerald Structured Trench Coat', 'Warm Cream Silk Blouse', 'Sage Slate Flat-front Skirt'],
    gala: ['Deep Emerald Velvet Backless Dress', 'Antique Bronze Embroidery', 'Bronze Drop Earrings'],
    swimwear: ['Amber High-waisted Vintage Bikini Set', 'Sage Green Mesh coverup']
  },
  fannie: {
    palette: 'Lavender, Deep Violet, Lilac, Metallic Silver',
    underwear: ['Violet Boxer Shorts', 'Lavender String', 'Lilac Crop Tank'],
    casual: ['Lavender Linen Shirt', 'Violet Cargo Pants', 'Metallic Silver High-top Sneaks'],
    official: ['Tailored Deep Violet Suit', 'Silk Lavender Dress Shirt', 'Silver Collar Clips'],
    gala: ['Asymmetrical Lavender Silk Gown', 'Silver Geometric Piping', 'Metallic Silver Cuff Bracelets'],
    swimwear: ['Violet Bikini Top', 'Violet Bikini Bottom', 'Asymmetrical Lilac Pareo']
  },
  emma: {
    palette: 'Midnight Black, Charcoal Gray, Crimson Red, Gold, Ivory White',
    underwear: ['Black Satin Plunge Bra', 'Crimson Mesh Boy Briefs', 'Sheer Modal Camisole'],
    casual: ['Oversized Black Premium Leather Jacket', 'Crimson Ribbed Tank Top', 'Charcoal Distressed Jeans'],
    official: ['Crimson Double-breasted Structured Blazer', 'Black Silk Shirt', 'Black Tailored Slim Pants', 'Gold Pin Accents'],
    gala: ['Midnight Black Corset Gown', 'Gold Lace Filigree', 'Crimson Velvet Caplet lining'],
    swimwear: ['Minimalist Black Cheeky Bikini', 'Gold Hardware Ring Accents', 'Sheer Crimson Wrap']
  }
};

export const WARDROBE_MD = `# NOOR QUARTET WARDROBE SYSTEM INITIALIZATION

This official manual documents the color palettes and curated clothing collections of the members of the alternative pop/electronic vocal quartet **Noor**. Each member has a distinct seasonal palette and a curated inventory for various settings, representing their unique style.

---

## MEMBER: MIRANDA NOOR (Soprano)

Miranda's style is ethereal, elevated, and artistic, reflecting her classical background and meticulous songwriting nature. Her wardrobe features light-catching satins, fluid silks, and platinum silver accents.

- **PALETTE:** Pale Blue, Deep Sapphire, Teal, Platinum Silver, Pearl White
- **UNDERWEAR:** Sapphire Blue Silk Bralette, Sapphire Blue Silk Panties, Teal Lace Boyshorts, Pearl White Seamless Camisole
- **CASUAL:** Sapphire Linen Button-down, White Raw-silk Wide-leg Trousers, Teal Knit Wrap Cardigan
- **OFFICIAL:** Crisp Sapphire Blazer, Matching Trousers, Pearl Silk Camisole, Platinum Silver Brooch
- **GALA:** Floor-length Highslit Sapphire Satin Gown, Silver Geometric Trim, Platinum Choker
- **SWIMWEAR:** Teal Active One-piece Swimsuit, Asymmetrical Sapphire Pareo

---

## MEMBER: ANNELIES BRINK (Alto)

Annelies represents the grounding, earthy soul of the group. Her wardrobe is based around warm, textured, organic fabrics, linen, chunky knits, and antique bronze details.

- **PALETTE:** Emerald Green, Sage, Amber, Bronze, Warm Cream
- **UNDERWEAR:** Amber Lace Bralette, Sage Green Comfy Cotton Briefs, Warm Cream Seamless Crop Top
- **CASUAL:** Cream Oversized Slouchy Knit Sweater, Sage Green Linen Utility Pants, Bronze Feather Pendant
- **OFFICIAL:** Emerald Structured Trench Coat, Warm Cream Silk Blouse, Sage Slate Flat-front Skirt
- **GALA:** Deep Emerald Velvet Backless Dress, Antique Bronze Embroidery, Bronze Drop Earrings
- **SWIMWEAR:** Amber High-waisted Vintage Bikini Set, Sage Green Mesh coverup

---

## MEMBER: FANNIE DE JONG (Mezzo-Soprano / Percussion)

Fannie's wardrobe is highly energetic, active, and bold. It channels lilac and ultraviolet tones with highly functional utility pockets to accommodate her kinetic drum-playing stance and spirited movement.

- **PALETTE:** Lavender, Deep Violet, Lilac, Metallic Silver
- **UNDERWEAR:** Violet Boxer Shorts, Lavender String, Lilac Crop Tank
- **CASUAL:** Lavender Linen Shirt, Violet Cargo Pants, Metallic Silver High-top Sneaks
- **OFFICIAL:** Tailored Deep Violet Suit, Silk Lavender Dress Shirt, Silver Collar Clips
- **GALA:** Asymmetrical Lavender Silk Gown, Silver Geometric Piping, Metallic Silver Cuff Bracelets
- **SWIMWEAR:** Violet Bikini Top, Violet Bikini Bottom, Asymmetrical Lilac Pareo

---

## MEMBER: EMMA VERMEER (Feminine Contralto / Synthesizers)

Emma is confident, mischievous, and sharp. Her look is highly structured with heavy premium leathers, rich velvets, and striking crimson and gold accents that command the stage.

- **PALETTE:** Midnight Black, Charcoal Gray, Crimson Red, Gold, Ivory White
- **UNDERWEAR:** Black Satin Plunge Bra, Crimson Mesh Boy Briefs, Sheer Modal Camisole
- **CASUAL:** Oversized Black Premium Leather Jacket, Crimson Ribbed Tank Top, Charcoal Distressed Jeans
- **OFFICIAL:** Crimson Double-breasted Structured Blazer, Black Silk Shirt, Black Tailored Slim Pants, Gold Pin Accents
- **GALA:** Midnight Black Corset Gown, Gold Lace Filigree, Crimson Velvet Caplet lining
- **SWIMWEAR:** Minimalist Black Cheeky Bikini, Gold Hardware Ring Accents, Sheer Crimson Wrap
`;
